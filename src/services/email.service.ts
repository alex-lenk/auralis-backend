// src/services/email.service.ts
import nodemailer from 'nodemailer'
import { config } from '../config'
import { AuthRoutes } from '../enum/routes'

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
})

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${config.frontendUrl}${AuthRoutes.VERIFY_EMAIL}?token=${token}`

  await transporter.sendMail({
    from: `"No Reply" <${config.EMAIL_USER}>`,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Please confirm your email by clicking the link below:</p>
           <a href="${verificationLink}">confirm registration</a>`
  })
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${config.frontendUrl}${AuthRoutes.FORGOT_PASSWORD}?token=${token}`

  await transporter.sendMail({
    from: `"No Reply" <${config.EMAIL_USER}>`,
    to: email,
    subject: 'Restoring access to your account',
    html: `<p>Confirm your intention to restore access by clicking on the link below:</p>
           <a href="${resetLink}">Get access</a>`
  })
}

export const sendNewPasswordEmail = async (email: string, newPassword: string) => {
  await transporter.sendMail({
    from: `"No Reply" <${config.EMAIL_USER}>`,
    to: email,
    subject: 'Ваш новый пароль',
    html: `<p>Ваш новый пароль: <strong>${newPassword}</strong></p>
           <p>Пожалуйста, войдите в систему и смените пароль после входа.</p>`
  })
}
