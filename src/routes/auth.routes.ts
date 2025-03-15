// src/routes/auth.routes.ts
import { FastifyInstance } from 'fastify'
import { AuthRoutes } from '../enum/routes'
import { verifyBearerToken } from '../middlewares/verifyBearerToken'
import {
  registerAnonymous,
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPasswordUser,
  resetPasswordUser,
} from '../controllers/auth.controller'
import {
  forgotPasswordSchema,
  loginSchema,
  logoutUserSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  anonymousSchema,
} from '../validation/authSchemas'
import { routeRateLimit } from '../config/rateLimit.config'

export default async function authRoutes(app: FastifyInstance) {
  app.post(AuthRoutes.REGISTER_ANONYMOUS, {
    schema: anonymousSchema,
    config: {
      rateLimit: routeRateLimit.anonymous
    }
  }, registerAnonymous)

  app.post(AuthRoutes.REGISTER, {schema: loginSchema}, registerUser)

  app.get(AuthRoutes.VERIFY_EMAIL, {schema: verifyEmailSchema}, verifyEmail)

  app.post(AuthRoutes.LOGIN, {
    schema: loginSchema,
    config: {rateLimit: routeRateLimit.forgotPassword},
  }, loginUser)

  app.post(AuthRoutes.LOGOUT, {preHandler: verifyBearerToken, schema: logoutUserSchema}, logoutUser)

  app.post(AuthRoutes.REFRESH, {preHandler: verifyBearerToken, schema: refreshTokenSchema}, refreshToken)

  app.post(AuthRoutes.FORGOT_PASSWORD, {
    schema: forgotPasswordSchema,
    config: {rateLimit: routeRateLimit.forgotPassword},
  }, forgotPasswordUser)

  app.get(AuthRoutes.FORGOT_PASSWORD, {
    schema: resetPasswordSchema,
    config: {rateLimit: routeRateLimit.forgotPassword},
  }, resetPasswordUser)
}
