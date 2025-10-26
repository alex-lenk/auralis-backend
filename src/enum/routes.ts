export const API_PREFIX = '/api/v1'

export enum AuthRoutes {
  PLAYLIST = `${API_PREFIX}/playlist/:mode.m3u8`,
  REGISTER_ANONYMOUS = `${API_PREFIX}/auth/anonymous`,
}
