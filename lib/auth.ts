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
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in Airtable
        const existingUsers = await AirtableService.find(TABLES.USERS, {
          filterByFormula: `{email} = "${user.email}"`
        })

        if (existingUsers.length === 0) {
          // Create new user in Airtable
          await AirtableService.create(TABLES.USERS, {
            email: user.email!,
            name: user.name || '',
            avatar_url: user.image || '',
            provider: account?.provider || '',
            provider_id: account?.providerAccountId || '',
            role: 'user',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          })
        } else {
          // Update last login
          await AirtableService.update(TABLES.USERS, existingUsers[0].id, {
            last_login: new Date().toISOString()
          })
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const users = await AirtableService.find(TABLES.USERS, {
            filterByFormula: `{email} = "${session.user.email}"`
          })

          if (users.length > 0) {
            session.user.id = users[0].id
            session.user.role = users[0].role || 'user'
          }
        } catch (error) {
          console.error('Error fetching user in session callback:', error)
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  }
}