// src/services/auth.service.ts
import { FastifyInstance } from 'fastify'
import { comparePassword, hashPassword } from '../utils/hash'
import { sendVerificationEmail } from './email.service'
import { InvalidPasswordError, UserNotFoundError, UserNotVerifiedError } from '../errors/auth.errors'
import { createUser, getUserByEmail, verifyUser } from '../repositories/user.repository'
import { createAnonymousUser, getAnonymousUserByFingerprint } from '../repositories/anonymousUser.repository'
import {
  deleteAllUserRefreshTokens,
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken
} from '../repositories/token.repository'
import {
  generateVerificationToken,
  verifyConfirmEmail,
  generateAccessToken,
  generateRefreshToken
} from '../utils/token'

export const registerAnonymousUser = async (fingerprint: string, userData?: object) => {
  let user = await getAnonymousUserByFingerprint(fingerprint)

  if (!user) {
    user = await createAnonymousUser(fingerprint, userData)
  }

  return user
}

export const register = async (fastify: FastifyInstance, email: string, password: string) => {
  const hashedPassword = await hashPassword(password)
  const token = generateVerificationToken(email)

  // Создаем пользователя в базе
  await createUser(fastify, email, hashedPassword, token)

  // Отправляем письмо с верификацией
  await sendVerificationEmail(email, token)

  return {message: 'User registered. Please check your email to verify your account.'}
}

export const confirmEmail = async (fastify: FastifyInstance, token: string) => {
  try {
    const {email} = verifyConfirmEmail(token)

    // Получаем пользователя через репозиторий
    const user = await getUserByEmail(fastify, email)
    if (!user) throw new Error('User or password wrong')

    if (user.is_verified) {
      throw new Error('Email already verified.')
    }

    if (user.verification_token !== token) {
      throw new Error('Invalid or expired token.')
    }

    // Верифицируем пользователя и удаляем токен
    await verifyUser(fastify, email)

    return {message: 'Email verified successfully.'}
  } catch {
    throw new Error('Invalid or expired token.')
  }
}

export const login = async (fastify: FastifyInstance, email: string, password: string) => {
  const user = await getUserByEmail(fastify, email)

  if (!user) {
    throw new UserNotFoundError()
  }

  const isValidPassword = await comparePassword(password, user.password)
  if (!isValidPassword) {
    throw new InvalidPasswordError()
  }

  if (!user.is_verified) {
    throw new UserNotVerifiedError()
  }

  const access = generateAccessToken({user_id: user.user_id, email: user.email})
  const refresh = generateRefreshToken()

  // Удаляем старые refresh-токены пользователя
  await deleteAllUserRefreshTokens(fastify, user.user_id)

  // Сохраняем новый refresh-токен
  await saveRefreshToken(fastify, user.user_id, refresh.value, refresh.expires_at)

  return {
    access,
    refresh,
    user: {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      // phone_number: user.phone_number,
      avatar_url: user.avatar_url,
      role: user.role,
      is_verified: user.is_verified,
      last_login_at: user.last_login_at,
      password_changed_at: user.password_changed_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  }
}

export const logout = async (fastify: FastifyInstance, refreshToken: string): Promise<boolean> => {
  const result = await deleteRefreshToken(fastify, refreshToken)
  return result > 0
}

export const refreshAccessToken = async (
  fastify: FastifyInstance,
  refreshToken: string,
  userId: string
) => {
  const storedToken = await getRefreshToken(fastify, refreshToken)

  // Проверяем, что refreshToken существует и принадлежит тому же пользователю
  if (!storedToken || storedToken.user_id !== userId) {
    throw new Error('Invalid refresh token')
  }

  // Генерация нового access token
  //const access = generateAccessToken(userId, '')
  const access = generateAccessToken({user_id: userId, email: ''})


  // Генерация нового refresh token
  const refresh = generateRefreshToken()

  // Удаляем старый refresh token
  await deleteRefreshToken(fastify, refreshToken)

  // Сохраняем новый refresh token
  await saveRefreshToken(fastify, userId, refresh.value, refresh.expires_at)

  return {access, refresh}
}
