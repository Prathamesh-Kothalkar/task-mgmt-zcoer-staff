// ...existing code...
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongoose'
import { Staff } from '@/model/Staff'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Staff Login',
      credentials: {
        empId: { label: 'Employee ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.empId || !credentials?.password) {
          throw new Error('Employee ID and password are required')
        }

        await dbConnect()

        // use consistent field name empId
        const staff = await Staff.findOne({ empId: credentials.empId })
        console.log(staff);
        if (!staff) {
          throw new Error('Invalid Employee ID or password')
        }
        console.log('EMployee presnt')
        //  Account disabled
        if (!staff.isActive) {
          throw new Error('Account is disabled. Contact admin.')
        }

        //Account locked
        if (staff.lockUntil && staff.lockUntil > new Date()) {
          throw new Error('Account locked. Try again later.')
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          staff.passwordHash
        )

        // Wrong password
        if (!isValidPassword) {
          staff.failedLoginAttempts += 1

          // Lock after 5 attempts
          if (staff.failedLoginAttempts >= 5) {
            staff.lockUntil = new Date(Date.now() + 15 * 60 * 1000)
          }

          await staff.save()
          throw new Error('Invalid Employee ID or password')
        }

        //Success
        staff.failedLoginAttempts = 0
        staff.lockUntil = null
        staff.lastLogin = new Date()
        await staff.save()

        return {
          id: staff._id.toString(),
          name: staff.name,
          empId: staff.empId,
          email: staff.email,
          role: staff.role,
          department: staff.department ? staff.department.toString() : null,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.empId = (user as any).empId
        token.email = user.email
        token.role = (user as any).role
        token.department = (user as any).department
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any
        u.id = token.id as string
        u.name = token.name as string
        u.empId = token.empId as string
        u.email = token.email as string
        u.role = token.role as string
        u.department = token.department as string
      }
      return session
    },
  },
}
