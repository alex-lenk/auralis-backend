import { FastifyReply, FastifyRequest } from 'fastify';
import { registerAnonymousUser } from '../services/auth.service';

export const registerAnonymous = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { fingerprint, deviceId, userData } = req.body as { fingerprint: string; deviceId: string; userData?: object };

    if (!deviceId) {
      return reply.badRequest('Fingerprint is required');
    }

    await registerAnonymousUser(fingerprint, deviceId, userData);

    return reply.status(204).send();
  } catch (error) {
    req.log.error(error);
    return reply.internalServerError('Something went wrong');
  }
};
