'use client'

import { useState } from 'react'
import { Rocket, Users, TrendingUp, ArrowRight, Star, CheckCircle, MessageSquare, Target, Lightbulb, UserPlus, Menu, X, BarChart3, User, Presentation, Award, Zap, Clock } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('idea')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Mock auth state
  const [userEmail, setUserEmail] = useState('') // Mock user data

  const isLoading = false // Mock loading state
  const mockUserName = userEmail ? userEmail.split('@')[0] : 'User'

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">UpStarter</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#come-funziona" className="text-gray-600 hover:text-gray-900 transition-colors">
                Come Funziona
              </a>
              <a href="#analizza" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analizza Idea
              </a>
              <a href="/team-up" className="text-gray-600 hover:text-gray-900 transition-colors">
                Trova Team
              </a>
              <a href="#pitch-deck" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pitch Deck
              </a>
              <a href="/startup-test" className="text-gray-600 hover:text-gray-900 transition-colors">
                Test Startup
              </a>
            </div>

            {/* Auth Buttons - Dynamic per stato login */}
            <div className="hidden md:flex items-center gap-3">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : isAuthenticated ? (
                // Utente loggato - Mostra Dashboard + Profile
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">
                      {mockUserName}
                    </span>
                  </div>
                  <a 
                    href="/dashboard" 
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </a>
                </>
              ) : (
                // Utente non loggato - Mostra Login + Signup
                <>
                  <a href="/auth/signin" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                    Accedi
                  </a>
                  <a href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Inizia Gratis
                  </a>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#come-funziona" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Come Funziona
                </a>
                <a href="#analizza" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Analizza Idea
                </a>
                <a href="/team-up" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Trova Team
                </a>
                <a href="#pitch-deck" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Pitch Deck
                </a>
                <a href="/startup-test" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Test Startup
                </a>
                <div className="flex flex-col gap-2 px-4 pt-3 border-t border-gray-200">
                  {isAuthenticated ? (
                    // Mobile - Utente loggato
                    <>
                      <div className="text-sm text-gray-600 px-4 py-2">
                        Benvenuto, {mockUserName}
                      </div>
                      <a 
                        href="/dashboard" 
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Vai alla Dashboard
                      </a>
                    </>
                  ) : (
                    // Mobile - Utente non loggato
                    <>
                      <a href="/auth/signin" className="text-center text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                        Accedi
                      </a>
                      <a href="/auth/signup" className="text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Inizia Gratis
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Dinamico per stato login */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {isAuthenticated ? (
              // Hero per utenti loggati
              <>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 font-medium">Benvenuto di nuovo!</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Continua il tuo{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    percorso
                  </span>{' '}
                  imprenditoriale
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Ciao {mockUserName}! 
                  Torna alla tua dashboard per continuare ad analizzare idee e costruire il tuo team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                    Inizia Gratuitamente
                  </a>
                  <a href="#come-funziona" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold">
                    Scopri Come Funziona
                  </a>
                </div>
              </>
            ) : (
              // Hero per utenti non loggati
              <>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Trasforma le tue{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    idee
                  </span>{' '}
                  in startup di successo
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  La piattaforma evolutiva che analizza le tue idee con sistema avanzato,
                  ti aiuta a trovare co-founder perfetti e ti guida verso il successo imprenditoriale.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                    Inizia Gratuitamente
                  </a>
                  <a href="#come-funziona" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold">
                    Scopri Come Funziona
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Quick Access per utenti loggati */}
      {isAuthenticated && (
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso Rapido</h2>
              <p className="text-gray-600">Le tue funzionalità preferite a portata di click</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <a 
                href="/dashboard/new-idea" 
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analizza Nuova Idea</h3>
                <p className="text-sm text-gray-600">Carica un documento o compila il form guidato</p>
              </a>

              <a 
                href="/team-up" 
                className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trova Co-founder</h3>
                <p className="text-sm text-gray-600">Esplora profili e crea il tuo team perfetto</p>
              </a>

              <a 
                href="/pitch-builder" 
                className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200 relative"
              >
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  NEW
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Presentation className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-orange-600 group-

      {/* Startup Readiness Test Promo Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-16 h-16 bg-orange-500 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-red-500 rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-0 relative">
                {/* Left Side - Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                    <Award className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-semibold text-sm">STARTUP READINESS TEST</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    La tua idea ha i requisiti per essere una{' '}
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      startup
                    </span>
                    ?
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Scopri in 3 minuti se la tua idea può diventare la prossima unicorn o se è più adatta per un business tradizionale
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>Solo 3 minuti</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Gratuito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Report istantaneo</span>
                    </div>
                  </div>

                  <a
                    href="/startup-test"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
                  >
                    Fai il Test Ora
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>

                {/* Right Side - Visual */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 flex flex-col justify-center text-white">
                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">Scalabilità</span>
                      </div>
                      <div className="text-sm text-orange-100">
                        Quanto può crescere la tua idea
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">Attrattività Investitori</span>
                      </div>
                      <div className="text-sm text-orange-100">
                        Se può interessare VC e angel
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">Prossimi Passi</span>
                      </div>
                      <div className="text-sm text-orange-100">
                        Roadmap personalizzata per te
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Come Funziona Section */}
      <section id="come-funziona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Come Funziona UpStarter</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processo semplice e guidato per trasformare la tua idea in una startup vincente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Analizza la Tua Idea</h3>
              <p className="text-gray-600 leading-relaxed">
                Il nostro sistema analizza la tua idea attraverso framework consolidati come Business Model Canvas e Lean Startup, fornendo un report dettagliato con punteggio e raccomandazioni.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Trova il Team Perfetto</h3>
              <p className="text-gray-600 leading-relaxed">
                Usa TeamUp per connetterti con co-founder, sviluppatori, marketer e altri professionisti. Il nostro algoritmo di matching trova le persone giuste per il tuo progetto.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Presentation className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Presenta agli Investitori</h3>
              <p className="text-gray-600 leading-relaxed">
                Crea pitch deck professionali con il nostro builder AI-powered. Template VC-ready, contenuti ottimizzati e export in tutti i formati per conquistare gli investitori.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section id="analizza" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Inizia Il Tuo Percorso Imprenditoriale</h2>
            <p className="text-xl text-gray-600">Scegli come vuoi iniziare la tua avventura startup</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-lg shadow-sm flex flex-wrap">
              <button
                onClick={() => setActiveTab('idea')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'idea'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analizza la Tua Idea
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'team'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trova il Team
              </button>
              <button
                onClick={() => setActiveTab('pitch')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                  activeTab === 'pitch'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Crea Pitch Deck
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  NEW
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'idea' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Analisi Sistema Evolutiva</h3>
                    <p className="text-gray-600 mb-6">
                      Il nostro sistema analizza la tua idea attraverso framework consolidati come Business Model Canvas e Lean Startup.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Report personalizzati e actionable</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Tracciamento dell'evoluzione nel tempo</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Suggerimenti di miglioramento continui</span>
                      </li>
                    </ul>
                    <a
                      href={isAuthenticated ? "/dashboard/new-idea" : "/auth/signup"}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      {isAuthenticated ? "Analizza Nuova Idea" : "Analizza la Tua Idea"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-500 mb-1">Punteggio Idea</div>
                      <div className="text-2xl font-bold text-blue-600">87%</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-500 mb-2">Analisi SWOT</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 p-2 rounded text-green-700">Punti di Forza</div>
                        <div className="bg-red-50 p-2 rounded text-red-700">Debolezze</div>
                        <div className="bg-blue-50 p-2 rounded text-blue-700">Opportunità</div>
                        <div className="bg-yellow-50 p-2 rounded text-yellow-700">Minacce</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-2">Prossimi Step</div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>• Validazione mercato</div>
                        <div>• Sviluppo MVP</div>
                        <div>• Team building</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                      <UserPlus className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">TeamUp: Trova Co-founder Perfetti</h3>
                    <p className="text-gray-600 mb-6">
                      Connettiti con sviluppatori, designer, marketer e altri imprenditori per creare il team dei tuoi sogni.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Matching intelligente basato su skill</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Profili verificati e dettagliati</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Sistema di messaggistica integrato</span>
                      </li>
                    </ul>
                    <a
                      href="/team-up"
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Trova il Tuo Team
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">MG</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Marco Giusti</div>
                          <div className="text-sm text-gray-500">Full-Stack Developer</div>
                        </div>
                        <div className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded text-xs">98% Match</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">SR</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Sara Rossi</div>
                          <div className="text-sm text-gray-500">UX/UI Designer</div>
                        </div>
                        <div className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded text-xs">95% Match</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">LB</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Luca Bianchi</div>
                          <div className="text-sm text-gray-500">Marketing Specialist</div>
                        </div>
                        <div className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded text-xs">92% Match</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pitch' && (
              <div id="pitch-deck" className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                      <Presentation className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Pitch Deck Builder AI-Powered</h3>
                    <p className="text-gray-600 mb-6">
                      Crea presentazioni professionali per investitori con il nostro sistema guidato dall'intelligenza artificiale.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Template VC-ready con 12 slide essenziali</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Contenuti AI generati dalle tue analisi</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Export PDF, PowerPoint, Keynote</span>
                      </li>
                    </ul>
                    <a
                      href={isAuthenticated ? "/pitch-builder" : "/auth/signup"}
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                    >
                      {isAuthenticated ? "Crea Pitch Deck" : "Inizia a Creare Pitch Deck"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                        <div className="text-xs text-orange-600 font-semibold mb-1">SLIDE 1</div>
                        <div className="text-sm font-medium text-gray-900">Title Slide</div>
                        <div className="text-xs text-gray-500">Company name • Tagline • Founder</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                        <div className="text-xs text-red-600 font-semibold mb-1">SLIDE 2</div>
                        <div className="text-sm font-medium text-gray-900">Problem</div>
                        <div className="text-xs text-gray-500">Pain points • Market needs</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                        <div className="text-xs text-green-600 font-semibold mb-1">SLIDE 3</div>
                        <div className="text-sm font-medium text-gray-900">Solution</div>
                        <div className="text-xs text-gray-500">Product overview • Benefits</div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-gray-600">+9 slide aggiuntive</div>
                        <div className="text-xs text-gray-500">Market • Business Model • Team • Funding</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cosa Dicono i Founder</h2>
            <p className="text-xl text-gray-600">Storie di successo dalla community UpStarter</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "UpStarter mi ha aiutato a strutturare la mia idea e trovare il co-founder perfetto. Ora la nostra startup ha raccolto 500K di investimenti!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">AM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alessandro Marini</div>
                  <div className="text-sm text-gray-500">Founder, TechFlow</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "L'analisi sistema mi ha aperto gli occhi su aspetti del mio business che non avevo considerato. Raccomando UpStarter a tutti gli aspiranti imprenditori!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">GF</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Giulia Ferretti</div>
                  <div className="text-sm text-gray-500">Founder, EcoStart</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Il Pitch Deck Builder mi ha permesso di creare una presentazione professionale che ha colpito gli investitori. Raccolti 1.2M in Serie A!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Marco Romano</div>
                  <div className="text-sm text-gray-500">Founder, InnovateLab</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            {isAuthenticated ? "Continua a Crescere con UpStarter" : "Pronto a Trasformare la Tua Idea in Realtà?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {isAuthenticated 
              ? "Il tuo percorso imprenditoriale è appena iniziato. Esplora nuove opportunità e costruisci il tuo futuro."
              : "Unisciti a migliaia di imprenditori che hanno scelto UpStarter per il loro percorso startup"
            }
          </p>
          <a
            href={isAuthenticated ? "/dashboard" : "/auth/signup"}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            {isAuthenticated ? (
              <>
                <BarChart3 className="w-5 h-5" />
                Vai alla Dashboard
              </>
            ) : (
              <>
                Inizia Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </a>
          <p className="text-blue-100 text-sm mt-4">
            {isAuthenticated 
              ? "I tuoi progetti ti stanno aspettando"
              : "Nessuna carta di credito richiesta • Setup in 2 minuti"
            }
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">UpStarter</span>
              </div>
              <p className="text-gray-400 mb-4">
                La piattaforma che trasforma idee in startup di successo.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Prodotto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#analizza" className="hover:text-white transition-colors">Analisi Idee</a></li>
                <li><a href="/team-up" className="hover:text-white transition-colors">TeamUp</a></li>
                <li><a href="#pitch-deck" className="hover:text-white transition-colors">Pitch Deck Builder</a></li>
                <li><a href="/startup-test" className="hover:text-white transition-colors">Test Startup</a></li>
                <li><a href="#come-funziona" className="hover:text-white transition-colors">Come Funziona</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Supporto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legale</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termini di Servizio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UpStarter. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}