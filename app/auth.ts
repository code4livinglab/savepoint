import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from 'bcryptjs'
import { object, string, ZodError } from "zod"

import { PrismaClient } from '@prisma/client'
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // バリデーション
          const { email, password } = await signInSchema.parseAsync(credentials)

          // ユーザー取得
          const prisma = new PrismaClient();
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (email !== user?.email) {
            console.log("Email or password is incorrect.")
            return null
          }

          const passwordMatch = await compare(password, user.password)
          if (!passwordMatch) {
            console.log("Email or password is incorrect.")
            return null
          }

          return { 
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
        }
        return null
      },
    }),
  ],
})
