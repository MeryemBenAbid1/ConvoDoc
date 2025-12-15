'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadBoxProps {
  onFileSelect: (file: File) => void
  selectedFile?: File | null
}

export default function UploadBox({ onFileSelect, selectedFile }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif'],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 sm:p-12
          transition-all duration-200 cursor-pointer
          ${isDragActive || isDragging
            ? 'border-gray-400 bg-gray-50'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${selectedFile ? 'border-gray-400 bg-gray-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {selectedFile ? (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <p className="text-sm font-medium text-gray-900 mb-1">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Click or drag to replace
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drop your document here
              </p>
              <p className="text-xs text-gray-500 mb-2">
                or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports: PDF, JPG, PNG, TIFF
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}





