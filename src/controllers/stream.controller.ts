// src/controllers/stream.controller.ts

import { FastifyReply, FastifyRequest } from 'fastify'
import { generatePlaylist } from '../services/stream.service'
import { getAnonymousUserByFingerprint } from '../repositories/anonymousUser.repository'

export async function getPlaylist(req: FastifyRequest<{
  Params: { mode: string },
  Querystring: { start?: string, fingerprint?: string }
}>, reply: FastifyReply) {
  const { mode } = req.params
  const fingerprint = req.query.fingerprint
  // Если start не указан, начинаем с 0
  const startSegment = parseInt(req.query.start ?? '0', 10)

  if (!fingerprint) {
    return reply.status(400).send({ error: 'Fingerprint is required' })
  }

  // Проверяем fingerprint
  const user = await getAnonymousUserByFingerprint(fingerprint)
  if (!user) {
    return reply.status(403).send({ error: 'Access denied. Invalid fingerprint' })
  }

  try {
    // Генерируем «одночасовой» плейлист из 60 аудиофайлов
    const playlist = await generatePlaylist(mode, startSegment)
    reply.type('application/vnd.apple.mpegurl').send(playlist)
  } catch (error) {
    req.log.error(error)
    return reply.status(500).send({ error: 'Error generating playlist' })
  }
}
