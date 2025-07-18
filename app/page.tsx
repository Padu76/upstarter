'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Rocket, Users, TrendingUp, ArrowRight, Star, CheckCircle, MessageSquare, Target, Lightbulb, UserPlus, Menu, X } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'idea' | 'team'>('idea')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <a href="#teamup" className="text-gray-600 hover:text-gray-900 transition-colors">
                Trova Team
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonianze
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                Accedi
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Inizia Gratis
              </Link>
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
                <a href="#teamup" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Trova Team
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Testimonianze
                </a>
                <div className="flex flex-col gap-2 px-4 pt-3 border-t border-gray-200">
                  <Link href="/auth/signin" className="text-center text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                    Accedi
                  </Link>
                  <Link href="/auth/signup" className="text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Inizia Gratis
                  </Link>
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
              <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                Inizia Gratuitamente
              </Link>
              <a href="#come-funziona" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold">
                Scopri Come Funziona
              </a>
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Cresci Costantemente</h3>
              <p className="text-gray-600 leading-relaxed">
                Ricevi un piano di miglioramento personalizzato con task actionable, tracking dei progressi e suggerimenti per aumentare le tue possibilità di successo.
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
            <div className="bg-white p-1 rounded-lg shadow-sm">
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trova il Team
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
                        <span className="text-gray-700">Tracciamento dell&apos;evoluzione nel tempo</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Suggerimenti di miglioramento continui</span>
                      </li>
                    </ul>
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Analizza la Tua Idea
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
              <div id="teamup" className="bg-white rounded-2xl shadow-xl p-8">
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
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Trova il Tuo Team
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
                &quot;UpStarter mi ha aiutato a strutturare la mia idea e trovare il co-founder perfetto. Ora la nostra startup ha raccolto 500K di investimenti!&quot;
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
                &quot;L&apos;analisi sistema mi ha aperto gli occhi su aspetti del mio business che non avevo considerato. Raccomando UpStarter a tutti gli aspiranti imprenditori!&quot;
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
                &quot;Grazie a TeamUp ho trovato un team incredibile. Siamo passati da un&apos;idea a un prodotto funzionante in soli 4 mesi!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
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
            Pronto a Trasformare la Tua Idea in Realtà?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Unisciti a migliaia di imprenditori che hanno scelto UpStarter per il loro percorso startup
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Inizia Gratuitamente
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-blue-100 text-sm mt-4">Nessuna carta di credito richiesta • Setup in 2 minuti</p>
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
                <li><a href="#teamup" className="hover:text-white transition-colors">TeamUp</a></li>
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