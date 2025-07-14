'use client'

import { Users, Plus, Search, MapPin, Code, Palette, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function TeamUpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">TeamUp - Trova il tuo Co-founder</h1>
        <p className="text-gray-600 text-lg">
          Connettiti con sviluppatori, designer, marketer e altri imprenditori per completare il tuo team startup
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Funzionalità in Arrivo</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Stiamo sviluppando la piattaforma di matching più avanzata per connettere founder con co-founder complementari. 
          Presto potrai trovare il partner perfetto per la tua startup!
        </p>
        <div className="flex justify-center">
          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            🚧 In Sviluppo - Q2 2025
          </span>
        </div>
      </div>

      {/* Preview Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
          <p className="text-gray-600">
            Algoritmo intelligente che trova co-founder in base a competenze complementari, 
            settore di interesse e obiettivi condivisi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Profili Verificati</h3>
          <p className="text-gray-600">
            Profili verificati con portfolio, track record e referenze per garantire 
            la qualità dei potenziali partner.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Equity Advisor</h3>
          <p className="text-gray-600">
            Strumenti per negoziare equity split in modo equo e trasparente, 
            con template legali e best practices.
          </p>
        </div>
      </div>

      {/* Role Categories Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Categorie di Co-founder</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Tech Co-founder</h3>
            <p className="text-sm text-gray-600">CTO, Developer</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Palette className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Design Co-founder</h3>
            <p className="text-sm text-gray-600">UX/UI, Product</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Business Co-founder</h3>
            <p className="text-sm text-gray-600">CEO, Sales, Marketing</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Industry Expert</h3>
            <p className="text-sm text-gray-600">Domain Knowledge</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Nel frattempo, continua a sviluppare la tua idea con le nostre analisi professionali
        </p>
        <Link
          href="/dashboard/new-idea"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Analizza la Tua Idea
        </Link>
      </div>
    </div>
  )
}