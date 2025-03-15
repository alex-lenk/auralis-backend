// src/handlers/error.handler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const customErrorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error.validation) {
    request.log.warn({validation: error.validation}, 'Validation error')

    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid request payload',
    })
  } else {
    request.log.error({
      type: error.name,
      message: error.message,
      route: request.routeOptions.url,
      method: request.method,
      ip: request.ip
    }, 'Internal error')

    reply.status(error.statusCode || 500).send({
      statusCode: error.statusCode || 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    })
  }
}
