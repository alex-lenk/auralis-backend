// src/middlewares/verifyBearerToken.ts
import { FastifyReply, FastifyRequest } from 'fastify'
import { verifyToken } from '../utils/token'

export async function verifyBearerToken(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader) {
    return reply.status(401).send({ message: 'Unauthorized: No token provided' })
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return reply.status(401).send({ message: 'Unauthorized: Invalid token format' })
  }

  try {
    // Декодирование токена и сохранение декодированные данные в request.user
    request.user = verifyToken(token)
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized: Token verification failed' })
  }
}

