// src/utils/token.ts
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { config } from '../config'

interface AccessTokenPayload {
  user_id: string
  email: string
}

export const generateVerificationToken = (email: string) => {
  return jwt.sign({email}, config.JWT_SECRET, {expiresIn: '1h'}) // 1 час на подтверждение
}

export const verifyConfirmEmail = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET) as {email: string}
}

export const verifyToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as AccessTokenPayload
}

export const generateAccessToken = ({ user_id, email }: AccessTokenPayload) => {
  const expiresIn = 15 * 60 // 15 минут
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn

  return {
    value: jwt.sign({user_id, email}, config.JWT_SECRET, {expiresIn}),
    expires_at: expiresAt
  }
}

export const generateRefreshToken = () => {
  const expiresIn = 7 * 24 * 60 * 60 // 7 дней
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn

  return {
    value: randomBytes(64).toString('hex'), // Генерируем случайную строку (64 символа)
    expires_at: expiresAt
  }
}

export const generateResetPasswordToken = (user_id: string, email: string): string => {
  const expiresIn = 30 * 60 // 30 минут
  // Токен содержит user_id и email для последующей валидации
  return jwt.sign({user_id, email}, config.JWT_SECRET, {expiresIn})
}
