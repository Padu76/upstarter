'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Rocket, Users, TrendingUp, ArrowRight, Star, CheckCircle, MessageSquare, Target, Lightbulb, UserPlus, Menu, X } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('idea')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                UpStarter
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors">Come funziona</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Storie</a>
              <Link href="/auth/signin">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Accedi
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors">Come funziona</a>
                <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Storie</a>
                <Link href="/auth/signin">
                  <button className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Accedi
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              Trasforma la tua{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                idea
              </span>
              <br />
              in una{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                startup
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              La piattaforma evolutiva che ti accompagna dalla validazione dell'idea alla costruzione del team perfetto. 
              Analizza, migliora e trova i co-founder giusti per il tuo progetto.
            </p>

            {/* CTA Tabs */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <div className="bg-white rounded-2xl p-2 shadow-xl border">
                <div className="flex rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveTab('idea')}
                    className={`px-8 py-4 font-semibold transition-all ${
                      activeTab === 'idea'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Analizza la tua idea</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`px-8 py-4 font-semibold transition-all ${
                      activeTab === 'team'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Trova il tuo team</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic CTA Content */}
            {activeTab === 'idea' && (
              <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl border">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <Target className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Valida e perfeziona la tua idea
                </h3>
                <p className="text-gray-600 mb-8">
                  Il nostro AI analizza la tua idea attraverso le lenti di un business plan professionale. 
                  Ottieni feedback evolutivi e migliora il tuo progetto nel tempo.
                </p>
                <Link href="/auth/signup">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center space-x-2 shadow-lg">
                    <span>Inizia l'analisi gratuita</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl border">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <UserPlus className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Costruisci il team perfetto
                </h3>
                <p className="text-gray-600 mb-8">
                  Connettiti con sviluppatori, designer, marketer e business developer. 
                  Il nostro matching engine trova i co-founder giusti per il tuo progetto.
                </p>
                <Link href="/auth/signup">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center space-x-2 shadow-lg">
                    <span>Entra in TeamUp</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tutto quello che serve per far decollare la tua startup
            </h2>
            <p className="text-xl text-gray-600">
              Una piattaforma completa per validare idee e costruire team vincenti
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analisi Evolutiva</h3>
              <p className="text-gray-600 mb-6">
                Il nostro AI analizza la tua idea attraverso framework consolidati come Business Model Canvas e Lean Startup.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                  Report personalizzati e actionable
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                  Tracciamento dell'evoluzione nel tempo
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                  Suggerimenti di miglioramento continui
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">TeamUp Matching</h3>
              <p className="text-gray-600 mb-6">
                Trova co-founder, sviluppatori, designer e marketer compatibili con il tuo progetto e la tua vision.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Algoritmo di matching intelligente
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Profili verificati e dettagliati
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Sistema di messaggistica integrato
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Evolutiva</h3>
              <p className="text-gray-600 mb-6">
                Gestisci tutti i tuoi progetti, connessioni e progressi da un'unica piattaforma intuitiva.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                  Storico completo dei progetti
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                  KPI di evoluzione e crescita
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                  Gestione team e collaborazioni
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Come funziona UpStarter
            </h2>
            <p className="text-xl text-gray-600">
              Tre semplici step per trasformare la tua idea in una startup di successo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analizza la tua idea</h3>
              <p className="text-gray-600">
                Descrivi il tuo progetto e rispondi al questionario guidato. Il nostro AI ti fornirà un'analisi dettagliata e suggerimenti di miglioramento.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trova il tuo team</h3>
              <p className="text-gray-600">
                Pubblica il tuo progetto su TeamUp e connettiti con co-founder, sviluppatori e marketer che condividono la tua vision.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fai crescere la startup</h3>
              <p className="text-gray-600">
                Gestisci l'evoluzione del progetto, traccia i progressi e continua a migliorare con feedback costanti e nuove connessioni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Storie di successo
            </h2>
            <p className="text-xl text-gray-600">
              Giovani imprenditori che hanno trasformato le loro idee in realtà
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "UpStarter mi ha aiutato a validare la mia idea e trovare il co-founder perfetto. In 3 mesi siamo passati da concept a MVP funzionante."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">M{i}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Marco Rossi</div>
                    <div className="text-sm text-gray-600">Founder, TechStartup</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto a trasformare la tua idea in realtà?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Unisciti a centinaia di giovani imprenditori che stanno costruendo il futuro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                Analizza la tua idea gratis
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                Esplora TeamUp
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">UpStarter</span>
              </div>
              <p className="text-sm">
                La piattaforma evolutiva per trasformare idee in startup di successo.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Prodotto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Analisi AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TeamUp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prezzi</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Risorse</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guida Startup</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Supporto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Azienda</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Chi siamo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carriere</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termini</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 UpStarter. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}