'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProgressSteps from '@/components/ProgressSteps'
import { processDocument } from '@/lib/api'
import { fileStorage } from '@/lib/fileStorage'

const PROCESSING_STEPS = [
  { id: 'detect-layout', label: 'Detecting Layout' },
  { id: 'detect-language', label: 'Detecting Language' },
  { id: 'ocr-text', label: 'OCR Text' },
  { id: 'detect-equations', label: 'Detecting Equations' },
  { id: 'rebuild-document', label: 'Rebuilding Document' },
]

export default function ProcessingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get file info from sessionStorage
    const fileInfo = sessionStorage.getItem('uploadedFile')
    if (!fileInfo) {
      router.push('/upload')
      return
    }

    // Process the file with the backend
    const processFile = async () => {
      try {
        await fileStorage.init()
        const fileData = JSON.parse(fileInfo)
        
        // Get the file from IndexedDB
        const file = await fileStorage.getFile(fileData.id)
        if (!file) {
          throw new Error('File not found. Please upload again.')
        }

        // Simulate progress steps while processing
        const progressInterval = setInterval(() => {
          setCurrentStep((prev) => {
            if (prev < PROCESSING_STEPS.length - 1) {
              return prev + 1
            }
            clearInterval(progressInterval)
            return prev
          })
        }, 1500)

        // Call the backend API
        const resultBlob = await processDocument(file)
        
        // Clear the progress interval
        clearInterval(progressInterval)
        setCurrentStep(PROCESSING_STEPS.length)

        // Store the result blob
        await fileStorage.storeResult(fileData.id, resultBlob)

        setIsComplete(true)
        
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/result')
        }, 1000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during processing')
        console.error('Processing error:', err)
      }
    }

    processFile()
  }, [router])

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/upload')}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 lg:p-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Processing Your Document
          </h1>
          <p className="text-center text-gray-600 mb-8 sm:mb-12">
            Please wait while we convert your document...
          </p>

          <div className="mb-8">
            <ProgressSteps
              currentStep={currentStep}
              steps={PROCESSING_STEPS}
            />
          </div>

          {isComplete && (
            <div className="text-center mt-8">
              <p className="text-sm text-green-600 font-medium">
                Processing complete! Redirecting...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}





