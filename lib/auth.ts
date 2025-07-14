import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AirtableService, TABLES } from './airtable'

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider per login con email/password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Per ora, accettiamo qualsiasi email/password per testing
        // In produzione, qui faresti il controllo del database
        if (credentials.email && credentials.password.length >= 6) {
          return {
            id: '1',
            email: credentials.email,
            name: credentials.email.split('@')[0],
          }
        }

        return null
      }
    }),
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
      // Per OAuth providers
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          if (!user.email) {
            console.error('No email provided by OAuth provider')
            return false
          }

          if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
            const existingUsers = await AirtableService.findRecords(TABLES.USERS, {
              filterByFormula: `{email} = "${user.email}"`
            })

            if (existingUsers.length === 0) {
              await AirtableService.createRecord(TABLES.USERS, {
                email: user.email,
                name: user.name || 'Utente',
                user_type: 'startup',
                created_at: new Date().toISOString()
              })
            }
          } else {
            console.warn('Airtable not configured, skipping user creation in database')
          }

          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return true
        }
      }

      // Per credentials provider
      if (account?.provider === 'credentials') {
        try {
          if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
            const existingUsers = await AirtableService.findRecords(TABLES.USERS, {
              filterByFormula: `{email} = "${user.email}"`
            })

            if (existingUsers.length === 0) {
              await AirtableService.createRecord(TABLES.USERS, {
                email: user.email!,
                name: user.name || 'Utente',
                user_type: 'startup',
                created_at: new Date().toISOString()
              })
            }
          }
        } catch (error) {
          console.error('Error creating user in database:', error)
        }
        return true
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
        token.userId = user.id // Cambiato da token.id a token.userId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        // Rimossa la riga che causava l'errore TypeScript
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 90 * 24 * 60 * 60, // 90 GIORNI
    updateAge: 24 * 60 * 60, // Aggiorna ogni 24h
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 90 * 24 * 60 * 60, // 90 GIORNI
        domain: process.env.NODE_ENV === 'production' 
          ? '.vercel.app' 
          : undefined
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 90 * 24 * 60 * 60 // 90 GIORNI
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 90 * 24 * 60 * 60 // 90 GIORNI
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}