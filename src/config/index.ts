// src/config/config.ts
import dotenv from 'dotenv'

dotenv.config()

export const config = {
  mode: process.env.MODE || 'develop ',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:7000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost',
  backendPort: Number(process.env.BACKEND_PORT) || 6000,
  cdnUrl: process.env.CDN_URL || 'http://localhost:6000',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'supersecret',
  DATABASE_URL: process.env.DB_PASSWORD,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_PORT: Number(process.env.EMAIL_PORT),
  EMAIL_HOST: process.env.EMAIL_HOST,
}
