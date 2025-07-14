import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { AirtableService, TABLES } from './airtable'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check that we have required user data
          if (!user.email) {
            console.error('No email provided by OAuth provider')
            return false
          }

          // Check if user exists in Airtable
          const existingUsers = await AirtableService.findRecords(TABLES.USERS, {
            filterByFormula: `{email} = "${user.email}"`
          })

          if (existingUsers.length === 0) {
            // Create new user in Airtable
            await AirtableService.createRecord(TABLES.USERS, {
              email: user.email,
              name: user.name || 'Utente',
              user_type: 'startup', // Default type
              created_at: new Date().toISOString()
            })
          }

          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
}