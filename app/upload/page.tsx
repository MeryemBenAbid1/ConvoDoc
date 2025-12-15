'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UploadBox from '@/components/UploadBox'
import { fileStorage } from '@/lib/fileStorage'

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleStartConversion = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    try {
      // Initialize file storage
      await fileStorage.init()
      
      // Generate a unique ID for this conversion
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Store the file in IndexedDB
      await fileStorage.storeFile(fileId, selectedFile)
      
      // Store file ID and metadata in sessionStorage
      sessionStorage.setItem('uploadedFile', JSON.stringify({
        id: fileId,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      }))

      // Navigate to processing page
      router.push('/processing')
    } catch (error) {
      console.error('Error storing file:', error)
      setIsProcessing(false)
      alert('Failed to store file. Please try again.')
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
            Upload Your Document
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
            Select a PDF or image file to convert to Word format
          </p>

          <div className="mb-6">
            <UploadBox
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          </div>

          <button
            onClick={handleStartConversion}
            disabled={!selectedFile || isProcessing}
            className={`
              w-full px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${
                selectedFile && !isProcessing
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isProcessing ? 'Processing...' : 'Start Conversion'}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Supported formats: PDF, JPG, PNG, TIFF
              <br />
              Maximum file size: 50MB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}





