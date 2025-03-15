export const anonymousSchema = {
  body: {
    type: 'object',
    required: ['fingerprint', 'userData'],
    properties: {
      fingerprint: { type: 'string', pattern: '^[a-f0-9]{64}$' },
      userData: { type: 'object' }
    }
  }
}

export const loginSchema = {
  body: {
    type: 'object',
    properties: {
      email: {type: 'string', format: 'email', maxLength: 50},
      password: {type: 'string', minLength: 8, maxLength: 24}
    },
    required: ['email', 'password'],
    additionalProperties: false
  }
}

export const forgotPasswordSchema = {
  body: {
    type: 'object',
    properties: {
      email: {type: 'string', format: 'email', maxLength: 50}
    },
    required: ['email'],
    additionalProperties: false
  }
}

export const resetPasswordSchema = {
  querystring: {
    type: 'object',
    properties: {
      token: {type: 'string', minLength: 10, maxLength: 255}
    },
    required: ['token'],
    additionalProperties: false
  }
}

export const verifyEmailSchema = {
  querystring: {
    type: 'object',
    properties: {
      token: {type: 'string', minLength: 10, maxLength: 255}
    },
    required: ['token'],
    additionalProperties: false
  }
}

export const refreshTokenSchema = {
  body: {
    type: 'object',
    properties: {
      refreshToken: {type: 'string', minLength: 20, maxLength: 500}
    },
    required: ['refreshToken'],
    additionalProperties: false
  }
}

export const logoutUserSchema = {
  body: {
    type: 'object',
    properties: {
      refreshToken: {type: 'string'}
    },
    required: ['refreshToken'],
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: {type: 'string'}
      }
    },
    400: {
      type: 'object',
      properties: {
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'}
      }
    },
    500: {
      type: 'object',
      properties: {
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'}
      }
    }
  }
}
