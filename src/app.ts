// src/app.ts
import path from 'path'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import rateLimit from '@fastify/rate-limit'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'

import { config } from './config'
import { globalRateLimit } from './config/rateLimit.config'
import drizzlePlugin from './plugins/drizzle'
import authRoutes from './routes/auth.routes'
import streamRoutes from './routes/stream.routes'
import { customErrorHandler } from './handlers/errorHandler'
import { logger } from './logger'

const app = Fastify({loggerInstance: logger})

app.setErrorHandler(customErrorHandler)

app.register(rateLimit, globalRateLimit)

app.register(cors, {
  origin: [config.frontendUrl],
  methods: ['POST', 'GET', 'PUT']
})

app.register(sensible)

app.register(drizzlePlugin)

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'audio'),
  prefix: '/audio/',
})

// Регистрация маршрутов
app.register(authRoutes)
app.register(streamRoutes)

const start = async () => {
  try {
    await app.listen({port: Number(config.backendPort)})
    app.log.info(`Server running on ${config.backendPort}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
