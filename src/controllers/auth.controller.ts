// src/controllers/auth.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify'
import { sendNewPasswordEmail, sendResetPasswordEmail } from '../services/email.service'
import { getUserByEmail, updateUserPassword } from '../repositories/user.repository'
import { generateResetPasswordToken, verifyToken } from '../utils/token'
import {
  register,
  registerAnonymousUser,
  confirmEmail,
  login,
  refreshAccessToken,
  logout
} from '../services/auth.service'
import { InvalidPasswordError, UserNotFoundError, UserNotVerifiedError } from '../errors/auth.errors'
import { hashPassword } from '../utils/hash'
import { generateRandomPassword } from '../utils/generateRandomPassword'

export const registerAnonymous = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {fingerprint, userData} = req.body as {fingerprint: string; userData?: object}

    if (!fingerprint) {
      return reply.badRequest('Fingerprint is required')
    }

    await registerAnonymousUser(fingerprint, userData)

    return reply.status(204).send()
  } catch (error) {
    req.log.error(error)
    return reply.internalServerError('Something went wrong')
  }
}

export const registerUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {email, password} = req.body as {email: string; password: string}

    if (!email || !password) {
      return reply.badRequest('Email and password are required')
    }

    const response = await register(req.server, email, password)
    return reply.status(201).send(response)
  } catch (err) {
    return reply.internalServerError(
      err instanceof Error
        ? err.message
        : 'An unknown error occurred'
    )
  }
}

export const verifyEmail = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {token} = req.query as {token: string}
    const response = await confirmEmail(req.server, token)
    return reply.send(response)
  } catch (err) {
    return reply.badRequest(err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {email, password} = req.body as {email: string; password: string}

    if (!email || !password) {
      return reply.badRequest('Email and password are required')
    }

    const response = await login(req.server, email, password)
    return reply.send(response)
  } catch (error) {
    if (error instanceof UserNotFoundError || error instanceof InvalidPasswordError) {
      return reply.unauthorized(error.message)
    }

    if (error instanceof UserNotVerifiedError) {
      return reply.forbidden(error.message)
    }

    return reply.internalServerError('Something went wrong')
  }
}

export const logoutUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {refreshToken} = req.body as {refreshToken: string}

    if (!refreshToken) {
      return reply.badRequest('Refresh token is required')
    }

    const deleted = await logout(req.server, refreshToken)

    if (!deleted) {
      return reply.badRequest('Refresh token not found')
    }

    return reply.send({message: 'Logged out successfully'})
  } catch (err) {
    return reply.internalServerError('Something went wrong')
  }
}

export const refreshToken = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {refreshToken} = req.body as {refreshToken: string}

    if (!refreshToken) {
      return reply.badRequest('Refresh token is required')
    }

    const userId = req.user?.user_id
    if (!userId) {
      return reply.unauthorized('User information missing')
    }

    const response = await refreshAccessToken(req.server, refreshToken, userId)
    return reply.send(response)
  } catch (err) {
    return reply.unauthorized(err instanceof Error ? err.message : 'Invalid refresh token')
  }
}

export const forgotPasswordUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {email} = req.body as {email: string}

    // Не раскрываем, существует пользователь или нет
    const user = await getUserByEmail(req.server, email)
    if (user) {
      // Генерация одноразового токена для сброса пароля с коротким сроком действия
      const resetToken = generateResetPasswordToken(user.user_id, email)

      // Реализовать: сохранить токен в БД, привязав его к пользователю, для последующей проверки

      // Отправляем email со ссылкой для сброса пароля
      await sendResetPasswordEmail(email, resetToken)
    }

    // Всегда возвращаем однотипный ответ, чтобы предотвратить email enumeration
    return reply.send({
      message: 'Если такой email существует, на него отправлено письмо со ссылкой для сброса пароля.'
    })
  } catch (error) {
    req.log.error(error)
    return reply.internalServerError('Ошибка обработки запроса')
  }
}

export const resetPasswordUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {token} = req.query as {token: string}
    const payload = verifyToken(token)
    const newPassword = generateRandomPassword(10)
    const hashedPassword = await hashPassword(newPassword)
    await updateUserPassword(req.server, payload.user_id, hashedPassword)
    await sendNewPasswordEmail(payload.email, newPassword)
    return reply.send({message: 'Новый пароль отправлен на ваш email.'})
  } catch (err) {
    req.log.error(err)
    return reply.status(401).send({message: 'Неверный или просроченный токен.'})
  }
}
