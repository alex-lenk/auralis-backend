export const globalRateLimit = {
  global: true,
  max: 100,
  timeWindow: 60 * 1000, // 1 минута
  cache: 10000
};

export const routeRateLimit = {
  login: {
    max: 5,
    timeWindow: 60 * 1000
  },
  forgotPassword: {
    max: 3,
    timeWindow: 60 * 1000
  },
  anonymous: { max: 10, timeWindow: '1 minute' },
};
