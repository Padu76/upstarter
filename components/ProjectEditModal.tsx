'use client'

import { useState, useEffect } from 'react'
import { X, Save, Plus, Trash2, Users, DollarSign, Target, TrendingUp } from 'lucide-react'

interface ProjectEditModalProps {
  project: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProject: any) => void
}

export default function ProjectEditModal({ project, isOpen, onClose, onSave }: ProjectEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMembers: [] as string[],
    marketSize: '',
    competitorsList: [] as string[],
    revenueModel: '',
    fundingNeeds: '',
    targetMarket: '',
    uniqueValue: '',
    businessModel: '',
    additionalNotes: ''
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        teamMembers: project.teamMembers || [],
        marketSize: project.marketSize || '',
        competitorsList: project.competitorsList || [],
        revenueModel: project.revenueModel || '',
        fundingNeeds: project.fundingNeeds || '',
        targetMarket: project.targetMarket || '',
        uniqueValue: project.uniqueValue || '',
        businessModel: project.businessModel || '',
        additionalNotes: project.additionalNotes || ''
      })
    }
  }, [project])

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, '']
    }))
  }

  const updateTeamMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }))
  }

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  const addCompetitor = () => {
    setFormData(prev => ({
      ...prev,
      competitorsList: [...prev.competitorsList, '']
    }))
  }

  const updateCompetitor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      competitorsList: prev.competitorsList.map((comp, i) => i === index ? value : comp)
    }))
  }

  const removeCompetitor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      competitorsList: prev.competitorsList.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    const updatedProject = {
      ...project,
      ...formData,
      teamMembers: formData.teamMembers.filter(member => member.trim()),
      competitorsList: formData.competitorsList.filter(comp => comp.trim()),
      updated_at: new Date().toISOString()
    }
    onSave(updatedProject)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
          <h2 className="text-2xl font-bold">Modifica Progetto</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Titolo */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titolo Progetto
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome del progetto"
            />
          </div>

          {/* Descrizione */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione del Progetto
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrizione dettagliata del progetto, problema che risolve, soluzione proposta"
            />
          </div>

          {/* Value Proposition */}
          <div className="bg-blue-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Valore Unico / Value Proposition
            </label>
            <textarea
              value={formData.uniqueValue}
              onChange={(e) => setFormData(prev => ({ ...prev, uniqueValue: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cosa rende unico il tuo prodotto? Qual è il valore distintivo per i clienti?"
            />
          </div>

          {/* Target Market */}
          <div className="bg-green-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Target Market e Clienti
            </label>
            <textarea
              value={formData.targetMarket}
              onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Chi sono i tuoi clienti target? Caratteristiche demografiche, comportamenti, bisogni"
            />
          </div>

          {/* Team Members */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 inline mr-1" />
                Team Members
              </label>
              <button
                onClick={addTeamMember}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Aggiungi Membro
              </button>
            </div>
            {formData.teamMembers.length === 0 && (
              <p className="text-gray-500 text-sm mb-3">Nessun membro del team aggiunto</p>
            )}
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateTeamMember(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome, ruolo ed esperienza del team member"
                />
                <button
                  onClick={() => removeTeamMember(index)}
                  className="text-red-600 hover:text-red-800"
                  title="Rimuovi membro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Market Size */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Dimensione del Mercato (TAM/SAM/SOM)
            </label>
            <textarea
              value={formData.marketSize}
              onChange={(e) => setFormData(prev => ({ ...prev, marketSize: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TAM (Total Addressable Market), SAM (Serviceable Addressable Market), SOM (Serviceable Obtainable Market)"
            />
          </div>

          {/* Competitors */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <Target className="w-4 h-4 inline mr-1" />
                Competitors
              </label>
              <button
                onClick={addCompetitor}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Aggiungi Competitor
              </button>
            </div>
            {formData.competitorsList.length === 0 && (
              <p className="text-gray-500 text-sm mb-3">Nessun competitor aggiunto</p>
            )}
            {formData.competitorsList.map((competitor, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={competitor}
                  onChange={(e) => updateCompetitor(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome competitor, caratteristiche principali e differenziazione"
                />
                <button
                  onClick={() => removeCompetitor(index)}
                  className="text-red-600 hover:text-red-800"
                  title="Rimuovi competitor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Business Model */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Modello di Business
            </label>
            <textarea
              value={formData.businessModel}
              onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="B2B, B2C, B2B2C, Marketplace, SaaS, ecc. Come funziona il tuo business?"
            />
          </div>

          {/* Revenue Model */}
          <div className="bg-green-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Modello di Ricavi
            </label>
            <textarea
              value={formData.revenueModel}
              onChange={(e) => setFormData(prev => ({ ...prev, revenueModel: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Come genera ricavi il progetto? Abbonamenti, vendite una tantum, commissioni, freemium, ecc."
            />
          </div>

          {/* Funding Needs */}
          <div className="bg-orange-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Fabbisogno di Finanziamento
            </label>
            <textarea
              value={formData.fundingNeeds}
              onChange={(e) => setFormData(prev => ({ ...prev, fundingNeeds: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quanto serve per raggiungere i prossimi milestone? Per cosa verranno usati i fondi?"
            />
          </div>

          {/* Additional Notes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Aggiuntive
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Altre informazioni importanti, milestone raggiunti, partnership, brevetti, ecc."
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-600">
            Le modifiche verranno salvate e potrai rigenerare l'analisi
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Salva Modifiche
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}