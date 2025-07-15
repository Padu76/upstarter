'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X, AlertCircle, CheckCircle, BarChart3, Download } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DocumentAnalyzer() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'text/plain' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'application/msword'
      
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      return isValidType && isValidSize
    })

    if (validFiles.length !== fileList.length) {
      setError('Alcuni file non sono supportati. Usa PDF, DOC, DOCX o TXT (max 10MB)')
    } else {
      setError(null)
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const analyzeDocument = async () => {
    if (files.length === 0) {
      setError('Seleziona almeno un documento')
      return
    }

    if (!session?.user?.email) {
      setError('Devi essere autenticato per analizzare documenti')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const file = files[0] // Analizza il primo file
      console.log('📄 Analyzing file:', file.name)

      // Leggi il contenuto del file
      let fileContent = ''
      if (file.type === 'text/plain') {
        fileContent = await file.text()
      } else if (file.type === 'application/pdf') {
        // Per PDF useremo una libreria di parsing
        setError('Supporto PDF in arrivo. Usa documenti di testo per ora.')
        setAnalyzing(false)
        return
      } else {
        // Per DOC/DOCX useremo una libreria di parsing
        setError('Supporto DOC/DOCX in arrivo. Usa documenti di testo per ora.')
        setAnalyzing(false)
        return
      }

      console.log('📄 File content length:', fileContent.length)

      // Chiamata API per analisi professionale
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          text: fileContent
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Errore durante l\'analisi del documento')
      }

      const result = await response.json()
      console.log('✅ Analysis result:', result)

      if (result.success) {
        // IMPORTANTE: Salva TUTTI i dati inclusi professional_analysis
        const completeAnalysisData = {
          id: result.analysis.id,
          project_id: result.project.id,
          title: result.project.title,
          description: result.project.description,
          score: result.project.score,
          overall_score: result.analysis.overall_score,
          analysis_data: result.analysis.analysis_data,
          professional_analysis: result.professional_analysis, // 🎯 CHIAVE!
          missing_areas: result.analysis.missing_areas,
          completeness_score: result.analysis.completeness_score,
          extracted_info: result.extracted_info,
          valuation_summary: result.valuation_summary,
          saved_to_airtable: result.saved_to_airtable,
          created_at: result.analysis.created_at,
          updated_at: result.project.updated_at,
          source: 'document_professional',
          type: 'professional'
        }

        // Salva nel localStorage con struttura completa
        localStorage.setItem(`analysis_${result.analysis.id}`, JSON.stringify(completeAnalysisData))
        
        // Salva anche nella lista progetti
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]')
        const newProject = {
          id: result.project.id,
          title: result.project.title,
          description: result.project.description,
          score: result.project.score,
          status: result.project.status,
          type: result.project.type,
          source: result.project.source,
          created_at: result.project.created_at,
          analysis_id: result.analysis.id // Link all'analisi
        }
        
        const updatedProjects = [newProject, ...existingProjects]
        localStorage.setItem('projects', JSON.stringify(updatedProjects))

        console.log('💾 Data saved to localStorage:', {
          analysisKey: `analysis_${result.analysis.id}`,
          hasProfessionalAnalysis: !!completeAnalysisData.professional_analysis,
          overallScore: completeAnalysisData.overall_score,
          valuationRange: completeAnalysisData.professional_analysis?.valuation_range
        })

        setAnalysisResult(completeAnalysisData)

        // Redirect alla pagina di analisi professionale
        setTimeout(() => {
          router.push(`/dashboard/analysis/${result.analysis.id}`)
        }, 2000)

      } else {
        throw new Error(result.error || 'Analisi fallita')
      }

    } catch (error) {
      console.error('❌ Analysis error:', error)
      setError(error instanceof Error ? error.message : 'Errore sconosciuto durante l\'analisi')
    } finally {
      setAnalyzing(false)
    }
  }

  if (analysisResult) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analisi Professionale Completata</h2>
            <p className="text-gray-600">Il tuo business plan è stato analizzato con successo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {analysisResult.overall_score}/100
              </div>
              <div className="text-sm text-blue-700">Score Complessivo</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {analysisResult.professional_analysis?.valuation_range?.recommended 
                  ? `€${(analysisResult.professional_analysis.valuation_range.recommended / 1000000).toFixed(1)}M`
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-green-700">Valutazione Raccomandata</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {analysisResult.valuation_summary?.confidence_level || 'Medium'}
              </div>
              <div className="text-sm text-purple-700">Livello di Confidenza</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Punti Salienti</h3>
            
            {analysisResult.professional_analysis?.recommendations?.slice(0, 3).map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push(`/dashboard/analysis/${analysisResult.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Visualizza Analisi Completa
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Analisi Professionale Business Plan</h2>
        <p className="text-lg text-gray-600">
          Carica il tuo business plan per un'analisi dettagliata stile venture capital
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Carica il tuo Business Plan
          </h3>
          <p className="text-gray-600 mb-4">
            Trascina i file qui o clicca per selezionare
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Seleziona File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">
            Supporta PDF, DOC, DOCX, TXT (max 10MB)
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">File selezionati:</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={analyzeDocument}
          disabled={files.length === 0 || analyzing}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            files.length === 0 || analyzing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {analyzing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Analizzando... Questo può richiedere alcuni minuti
            </div>
          ) : (
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Avvia Analisi Professionale
            </div>
          )}
        </button>
      </div>

      {analyzing && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <h4 className="font-semibold text-blue-900">Analisi in corso...</h4>
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <p>✅ Estrazione del contenuto</p>
            <p>🔍 Analisi di mercato e competitività</p>
            <p>💰 Valutazione con metodi VC professionali</p>
            <p>📊 Calcolo score e raccomandazioni</p>
            <p>💾 Salvataggio risultati...</p>
          </div>
        </div>
      )}
    </div>
  )
}