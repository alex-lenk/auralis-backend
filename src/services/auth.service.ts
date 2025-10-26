import { createAnonymousUser, getAnonymousUserByFingerprint } from '../repositories/anonymousUser.repository'

export const registerAnonymousUser = async (fingerprint: string, deviceId: string, userData?: object) => {
  let user = await getAnonymousUserByFingerprint(deviceId)

  if (!user) {
    user = await createAnonymousUser(fingerprint, deviceId, userData)
  }

  return user
}
