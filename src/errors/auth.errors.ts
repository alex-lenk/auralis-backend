export class UserNotFoundError extends Error {
  constructor() {
    super('User or password wrong')
    this.name = 'UserNotFoundError'
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('User or password wrong')
    this.name = 'InvalidPasswordError'
  }
}

export class UserNotVerifiedError extends Error {
  constructor() {
    super('User is not verified')
    this.name = 'UserNotVerifiedError'
  }
}
