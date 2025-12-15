"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fileStorage } from '@/lib/fileStorage'
import { downloadBlob } from '@/lib/api'

export default function ResultPage() {
  const [fileName, setFileName] = useState<string>('converted.docx')
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get file info from sessionStorage
    const fileInfo = sessionStorage.getItem('uploadedFile')
    if (!fileInfo) {
      router.push('/upload')
      return
    }

    try {
      const fileData = JSON.parse(fileInfo)
      const originalName = fileData.name.replace(/\.[^/.]+$/, '') // Remove extension
      setFileName(`${originalName}.docx`)
    } catch (error) {
      console.error('Error parsing file info:', error)
    }
  }, [router])

  const downloadFile = async () => {
    try {
      setIsDownloading(true)
      
      // Get file info from sessionStorage
      const fileInfo = sessionStorage.getItem('uploadedFile')
      if (!fileInfo) {
        alert('File information not found. Please upload again.')
        router.push('/upload')
        return
      }

      await fileStorage.init()
      const fileData = JSON.parse(fileInfo)
      
      // Get the result blob from IndexedDB
      const resultBlob = await fileStorage.getResult(fileData.id)
      
      if (!resultBlob) {
        alert('Processed file not found. Please try processing again.')
        router.push('/upload')
        return
      }

      // Download the file
      downloadBlob(resultBlob, fileName)

      // Clean up stored files after a delay
      setTimeout(() => {
        fileStorage.clear(fileData.id).catch(console.error)
      }, 1000)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  };

  const handleProcessAnother = () => {
    // Clear session storage
    sessionStorage.removeItem('uploadedFile')
    router.push('/upload')
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Conversion Complete!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your document has been successfully converted to Word format.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadFile}
              disabled={isDownloading}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${isDownloading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}
            >
              {isDownloading ? 'Downloading...' : 'Download Word File'}
            </button>

            <button
              onClick={handleProcessAnother}
              className="px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
            >
              Process Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
