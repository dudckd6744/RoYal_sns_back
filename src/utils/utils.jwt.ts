/* eslint-disable @typescript-eslint/ban-types */
import * as jwt from "jsonwebtoken"

const jwtSecret = process.env.JWT_SECRET

export async function signToken(
  payload: Object,
  options: jwt.SignOptions = {},
): Promise<string> {
  const { expiresIn } = options
  return new Promise((res, rej) =>
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: expiresIn ?? '1d' },
      (err, token) => {
        if (err) rej(err)
        res(token)
      },
    ),
  )
}

export async function verifyToken(token: string): Promise<any> {
  return new Promise((res, rej) =>
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) rej(err)
      res(decoded)
    }),
  )
}
