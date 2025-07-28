'use client'

import { useState } from 'react'
import { Rocket, Users, TrendingUp, ArrowRight, Star, CheckCircle, MessageSquare, Target, Lightbulb, UserPlus, Menu, X, BarChart3, User, Presentation, Award, Zap, Clock } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('idea')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Homepage unica per tutti
  const [userEmail, setUserEmail] = useState('')

  const isLoading = false
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
              <a href="#analizza-idea" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analizza Idea
              </a>
              <a href="#trova-team" className="text-gray-600 hover:text-gray-900 transition-colors">
                Trova Team
              </a>
              <a href="#pitch-deck" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pitch Deck
              </a>
              <a href="#startup-test" className="text-gray-600 hover:text-gray-900 transition-colors">
                Test Startup
              </a>
              <a href="#financial-planning" className="text-gray-600 hover:text-gray-900 transition-colors">
                Financial Planning
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">{mockUserName}</span>
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
                <a href="#analizza-idea" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Analizza Idea
                </a>
                <a href="#trova-team" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Trova Team
                </a>
                <a href="#pitch-deck" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Pitch Deck
                </a>
                <a href="#startup-test" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Test Startup
                </a>
                <a href="#financial-planning" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Financial Planning
                </a>
                <div className="flex flex-col gap-2 px-4 pt-3 border-t border-gray-200">
                  {isAuthenticated ? (
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

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 font-medium">Benvenuto di nuovo!</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Come Funziona{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    UpStarter
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  Un processo semplice e guidato per trasformare la tua idea in una startup vincente
                </p>

                {/* Come Funziona Steps */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Analizza la Tua Idea</h3>
                    <p className="text-gray-600 text-sm">
                      Sistema evolutivo con framework consolidati come Business Model Canvas e Lean Startup
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Trova il Team</h3>
                    <p className="text-gray-600 text-sm">
                      Connettiti con co-founder, sviluppatori e marketer per il tuo progetto
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Presentation className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Presenta agli Investitori</h3>
                    <p className="text-gray-600 text-sm">
                      Crea pitch deck professionali con il nostro builder AI-powered
                    </p>
                  </div>
                </div>
              </>
            ) : (
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

      {/* Funzionalità Principali - 5 Riquadri Stile Quiz */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Le Tue Funzionalità</h2>
            <p className="text-xl text-gray-600">Tutto quello di cui hai bisogno per trasformare la tua idea in startup</p>
          </div>

          <div className="space-y-16">
            {/* 1. Analizza Idea */}
            <div id="analizza-idea" className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100 relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-blue-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-indigo-500 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-0 relative">
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 font-semibold text-sm">ANALISI EVOLUTIVA</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Analizza la tua{' '}
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        idea
                      </span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Sistema evolutivo che analizza la tua idea attraverso framework consolidati come Business Model Canvas e Lean Startup
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span>Framework avanzati</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Report dettagliati</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span>Tracking evoluzione</span>
                      </div>
                    </div>

                    <a
                      href={isAuthenticated ? "/dashboard/new-idea" : "/auth/signup"}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
                    >
                      {isAuthenticated ? "Analizza Ora" : "Inizia Analisi"}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex flex-col justify-center text-white">
                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Business Model Canvas</span>
                        </div>
                        <div className="text-sm text-blue-100">
                          Framework completo per validare il modello di business
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Analisi SWOT</span>
                        </div>
                        <div className="text-sm text-blue-100">
                          Punti di forza, debolezze, opportunità e minacce
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Score & Raccomandazioni</span>
                        </div>
                        <div className="text-sm text-blue-100">
                          Punteggio dettagliato con suggerimenti actionable
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Trova Team */}
            <div id="trova-team" className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-purple-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-pink-500 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-0 relative">
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 font-semibold text-sm">TEAM MATCHING</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Trova il tuo{' '}
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        dream team
                      </span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Connettiti con co-founder, developer, designer e marketer perfetti per il tuo progetto attraverso il nostro algoritmo di matching
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>Matching intelligente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Profili verificati</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span>Chat integrata</span>
                      </div>
                    </div>

                    <a
                      href={isAuthenticated ? "/team-up" : "/auth/signup"}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
                    >
                      {isAuthenticated ? "Trova Team" : "Inizia Matching"}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 flex flex-col justify-center text-white">
                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Co-founder Matching</span>
                        </div>
                        <div className="text-sm text-purple-100">
                          Trova il partner perfetto per la tua startup
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Skill-based Search</span>
                        </div>
                        <div className="text-sm text-purple-100">
                          Developer, designer, marketer e business expert
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Profili Verificati</span>
                        </div>
                        <div className="text-sm text-purple-100">
                          Background check e portfolio validati
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Pitch Deck */}
            <div id="pitch-deck" className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-orange-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-red-500 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-0 relative">
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Presentation className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-semibold text-sm">AI-POWERED</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Crea il{' '}
                      <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        pitch perfetto
                      </span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Builder AI-powered per creare presentazioni professionali che conquistano gli investitori con template VC-ready
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Presentation className="w-4 h-4 text-orange-600" />
                        <span>12 slide essenziali</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span>AI generato</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Export multipli</span>
                      </div>
                    </div>

                    <a
                      href={isAuthenticated ? "/pitch-builder" : "/auth/signup"}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
                    >
                      {isAuthenticated ? "Crea Pitch" : "Inizia Builder"}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 flex flex-col justify-center text-white">
                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Presentation className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Template VC-Ready</span>
                        </div>
                        <div className="text-sm text-orange-100">
                          Struttura ottimizzata per fondi di investimento
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">AI Content Generation</span>
                        </div>
                        <div className="text-sm text-orange-100">
                          Contenuti generati dalle tue analisi automaticamente
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Export Versatile</span>
                        </div>
                        <div className="text-sm text-orange-100">
                          PDF, PowerPoint, Keynote e formati web
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
            {/* 4. Startup Test */}
            <div id="startup-test" className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100 relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-500 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-0 relative">
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Award className="w-4 h-4 text-red-600" />
                      <span className="text-red-700 font-semibold text-sm">STARTUP READINESS TEST</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      La tua idea ha i requisiti per essere una{' '}
                      <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        startup
                      </span>
                      ?
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Scopri in 3 minuti se la tua idea può diventare la prossima unicorn o se è più adatta per un business tradizionale
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-600" />
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
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
                    >
                      Fai il Test Ora
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-red-500 to-orange-600 p-8 flex flex-col justify-center text-white">
                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Scalabilità</span>
                        </div>
                        <div className="text-sm text-red-100">
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
                        <div className="text-sm text-red-100">
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
                        <div className="text-sm text-red-100">
                          Roadmap personalizzata per te
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Financial Planning */}
            <div id="financial-planning" className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100 relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-green-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-0 relative">
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-semibold text-sm">FINANCIAL PLANNING</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Pianifica le tue{' '}
                      <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                        finanze
                      </span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Strumenti avanzati per budget, forecast e analisi finanziarie. Monitora burn rate, runway e metriche chiave della tua startup
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        <span>Budget dinamico</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>Forecast 3 anni</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span>KPI tracking</span>
                      </div>
                    </div>

                    <a
                      href={isAuthenticated ? "/dashboard/financial-planning" : "/auth/signup"}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
                    >
                      {isAuthenticated ? "Inizia Planning" : "Pianifica Ora"}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 flex flex-col justify-center text-white">
                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Budget & Forecast</span>
                        </div>
                        <div className="text-sm text-green-100">
                          Pianificazione finanziaria a 3 anni con scenario analysis
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">Burn Rate & Runway</span>
                        </div>
                        <div className="text-sm text-green-100">
                          Monitora velocità di spesa e durata capitale
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">KPI Dashboard</span>
                        </div>
                        <div className="text-sm text-green-100">
                          CAC, LTV, MRR e tutte le metriche essenziali
                        </div>
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