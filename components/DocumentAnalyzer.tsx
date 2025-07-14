'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, File, X, Loader, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentAnalyzerProps {
  onAnalysisComplete: (analysis: any) => void
}

export default function DocumentAnalyzer({ onAnalysisComplete }: DocumentAnalyzerProps) {
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
      'application/pdf': ['.pdf'],
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

      if (!response.ok) {
        throw new Error('Errore durante l\'analisi del documento')
      }

      const analysis = await response.json()
      onAnalysisComplete(analysis)

    } catch (error) {
      console.error('Error analyzing document:', error)
      setError('Errore durante l\'analisi del documento')
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
      case 'pdf':
        return <File className="w-8 h-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />
      case 'txt':
        return <FileText className="w-8 h-8 text-gray-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Upload className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Analizza Documento</h3>
          <p className="text-gray-600">Carica un PDF, Word o file di testo con la presentazione del tuo progetto</p>
        </div>
      </div>

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
            <span className="bg-gray-100 px-2 py-1 rounded">.PDF</span>
            <span className="bg-gray-100 px-2 py-1 rounded">.DOCX</span>
            <span className="bg-gray-100 px-2 py-1 rounded">.DOC</span>
            <span className="bg-gray-100 px-2 py-1 rounded">.TXT</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Max 10MB</p>
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
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
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