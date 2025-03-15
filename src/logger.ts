// src/logger.ts
import path from 'path';
import dayjs from 'dayjs';
import pino from 'pino';

const logFileName = `${dayjs().format('YYYY-MM-DD')}.log`;
const logFilePath = path.join(__dirname, '../logs', logFileName);

export const logger = pino(
  {
    level: 'info',
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          ip: request.ip,
        };
      },
      res(reply) {
        return {
          statusCode: reply.statusCode,
        };
      },
      err(error) {
        return {
          type: error.name,
          message: error.message,
          stack: error.stack || '',
        };
      },
    },
  },
  pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: logFilePath },
      },
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    ],
  })
);
