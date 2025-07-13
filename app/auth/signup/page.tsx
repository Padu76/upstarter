'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Rocket, Mail, Github, ArrowRight, Loader2, User, Building } from 'lucide-react'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<'startup' | 'investor'>('startup')

  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { 
        callbackUrl: userType === 'startup' ? '/dashboard' : '/investor/dashboard',
        userType: userType
      })
    } catch (error) {
      console.error('Errore durante la registrazione:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
            <Rocket className="w-8 h-8 text-blue-600" />
            UpStarter
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unisciti a UpStarter</h1>
          <p className="text-gray-600">Trasforma le tue idee in startup di successo</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Che tipo di utente sei?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUserType('startup')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'startup'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Startupper</div>
              <div className="text-xs text-gray-500">Ho un'idea o progetto</div>
            </button>
            <button
              onClick={() => setUserType('investor')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'investor'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Investitore</div>
              <div className="text-xs text-gray-500">Cerco opportunità</div>
            </button>
          </div>
        </div>

        {/* Social Signup Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialSignUp('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continua con Google
              </>
            )}
          </button>

          <button
            onClick={() => handleSocialSignUp('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Github className="w-5 h-5" />
                Continua con GitHub
              </>
            )}
          </button>
        </div>

        {/* Benefits */}
        <div className={`mt-6 p-4 rounded-lg ${
          userType === 'startup' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
        }`}>
          <h3 className="font-semibold text-sm mb-2">
            {userType === 'startup' ? 'Come Startupper ottieni:' : 'Come Investitore ottieni:'}
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {userType === 'startup' ? (
              <>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Analisi AI delle tue idee
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Matching con co-founder e investitori
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Piano di miglioramento personalizzato
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Deal flow pre-qualificato da AI
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Matching intelligente con startup
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Analytics e insights avanzati
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Hai già un account?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Accedi qui
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Registrandoti accetti i nostri{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Termini di Servizio
            </Link>{' '}
            e la{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}