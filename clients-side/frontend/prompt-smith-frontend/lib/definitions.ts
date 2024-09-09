import {z} from 'zod'

export const SimpleSigninSchema = z.object({
  bearerToken: z
    .string()
    .min(1, {message: 'Be at least 1 character long'})
    // .regex(/[a-zA-Z]/, {message: 'Contain at least one letter.'})
    // .regex(/[0-9]/, {message: 'Contain at least one number.'})
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim(),
})


export type SessionPayload = {
  bearerToken: string
}
