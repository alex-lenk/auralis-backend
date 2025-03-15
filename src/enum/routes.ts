// src/enum/routes.ts
export const API_PREFIX = '/api/v1'

export enum AuthRoutes {
  PLAYLIST = `${API_PREFIX}/playlist/:mode.m3u8`,
  REGISTER = `${API_PREFIX}/auth/register`,
  REGISTER_ANONYMOUS = `${API_PREFIX}/auth/anonymous`,
  VERIFY_EMAIL = `${API_PREFIX}/auth/verify-email`,
  LOGIN = `${API_PREFIX}/auth/login`,
  REFRESH = `${API_PREFIX}/auth/refresh`,
  LOGOUT = `${API_PREFIX}/auth/logout`,
  FORGOT_PASSWORD = `${API_PREFIX}/auth/forgot-password`,
}
