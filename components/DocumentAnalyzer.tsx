'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSession, signIn } from 'next-auth/react'
import { Upload, FileText, File, X, Loader, CheckCircle, AlertCircle, LogIn } from 'lucide-react'

interface DocumentAnalyzerProps {
  onAnalysisComplete: (analysis: any) => void
}

export default function DocumentAnalyzer({ onAnalysisComplete }: DocumentAnalyzerProps) {
  const { data: session, status } = useSession()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setError('')
      extractTextFromFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const extractTextFromFile = async (file: File) => {
    setIsAnalyzing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Errore durante l\'estrazione del testo')
      }

      const data = await response.json()
      setExtractedText(data.text)

    } catch (error) {
      console.error('Error extracting text:', error)
      setError('Errore durante l\'estrazione del testo dal documento')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeExtractedText = async () => {
    if (!extractedText) return

    // Check auth status before proceeding
    if (status === 'loading') {
      setError('Verifica dello stato di autenticazione in corso...')
      return
    }

    if (!session) {
      setError('Devi essere autenticato per analizzare documenti')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: extractedText,
          fileName: uploadedFile?.name
        })
      })

      if (response.status === 401) {
        throw new Error('Sessione scaduta. Effettua nuovamente il login.')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Errore durante l\'analisi del documento')
      }

      const result = await response.json()
      
      // Salva i dati dell'analisi in localStorage per il recupero
      if (result.analysisData) {
        localStorage.setItem(`analysis_${result.projectId}`, JSON.stringify(result.analysisData))
      }

      onAnalysisComplete(result)

    } catch (error) {
      console.error('Error analyzing document:', error)
      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'analisi del documento'
      setError(errorMessage)
      
      // Se è un errore di autenticazione, suggerisci il re-login
      if (errorMessage.includes('Sessione scaduta') || errorMessage.includes('Non autorizzato')) {
        setError('Sessione scaduta. Clicca qui per effettuare nuovamente il login.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedText('')
    setError('')
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />
      case 'txt':
        return <FileText className="w-8 h-8 text-gray-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  // Show login requirement if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Richiesto</h3>
          <p className="text-gray-600 mb-6">
            Devi essere autenticato per analizzare documenti
          </p>
          <button
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Accedi
          </button>
        </div>
      </div>
    )
  }

  // Show loading if session is loading
  if (status === 'loading') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifica autenticazione...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Upload className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Analizza Documento</h3>
          <p className="text-gray-600">Carica un file Word o di testo con la presentazione del tuo progetto</p>
        </div>
      </div>

      {/* Auth Status Indicator */}
      {session && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">
              Autenticato come: {session.user?.email}
            </span>
          </div>
        </div>
      )}

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            {isDragActive ? 'Rilascia il file qui' : 'Carica un documento'}
          </h4>
          <p className="text-gray-500 mb-4">
            Trascina e rilascia il tuo file o clicca per selezionarlo
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
            <span className="bg-gray-100 px-2 py-1 rounded">.DOCX</span>
            <span className="bg-gray-100 px-2 py-1 rounded">.DOC</span>
            <span className="bg-gray-100 px-2 py-1 rounded">.TXT</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Max 10MB</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Per file PDF:</strong> Convertili in formato Word (.docx) o copia il testo in un file .txt
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {getFileIcon(uploadedFile.name)}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{uploadedFile.name}</h4>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Text Preview */}
          {extractedText && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Testo Estratto
              </h4>
              <div className="max-h-32 overflow-y-auto text-sm text-gray-600 bg-white p-3 rounded border">
                {extractedText.substring(0, 500)}
                {extractedText.length > 500 && '...'}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {extractedText.length} caratteri estratti
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes('Sessione scaduta') && (
                  <button
                    onClick={() => signIn()}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Effettua Login
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {extractedText && !isAnalyzing && (
              <button
                onClick={analyzeExtractedText}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Analizza Documento
              </button>
            )}

            {isAnalyzing && (
              <div className="flex-1 bg-gray-100 text-gray-600 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                {extractedText ? 'Analizzando...' : 'Estraendo testo...'}
              </div>
            )}

            <button
              onClick={removeFile}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Rimuovi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}