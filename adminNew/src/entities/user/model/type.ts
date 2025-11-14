import type z from "zod";
import type { authResponseSchema, loginSchema, usernewSchema, userSchema } from "../model/schema"


export type User = z.infer<typeof userSchema>
export type newUser = z.infer<typeof usernewSchema>
export type loginUser = z.infer<typeof loginSchema>
export type authResponse = z.infer<typeof authResponseSchema>
export type UserWithoutPassword = Omit<User, 'password'>
