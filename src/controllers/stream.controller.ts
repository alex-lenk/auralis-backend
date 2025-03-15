import { FastifyReply, FastifyRequest } from 'fastify'
import { generatePlaylist } from '../services/stream.service'
import { getAnonymousUserByFingerprint } from '../repositories/anonymousUser.repository'

export async function getPlaylist(req: FastifyRequest<{
  Params: {mode: string},
  Querystring: {hour?: string, fingerprint?: string}
}>, reply: FastifyReply) {
  const {mode} = req.params
  const hour = Number(req.query.hour) || 0
  const fingerprint = req.query.fingerprint

  if (!fingerprint) {
    return reply.status(400).send({error: 'Fingerprint is required'})
  }

  // Проверка fingerprint в базе
  const user = await getAnonymousUserByFingerprint(fingerprint)
  if (!user) {
    return reply.status(403).send({error: 'Access denied. Invalid fingerprint'})
  }

  try {
    const playlist = await generatePlaylist(mode, hour)
    reply.type('application/vnd.apple.mpegurl').send(playlist)
  } catch (error) {
    req.log.error(error)
    return reply.status(500).send({error: 'Error generating playlist'})
  }
}
