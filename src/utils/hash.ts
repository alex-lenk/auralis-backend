// src/utils/hash.ts
import bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 11)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword)
}
