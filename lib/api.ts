import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create a configured axios instance with proper connection handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for file processing
  maxRedirects: 5,
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
})

export interface ProcessResponse {
  success: boolean
  message?: string
}

export async function processDocument(file: File): Promise<Blob> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiClient.post(
      '/process',
      formData,
      {
        responseType: 'blob',
      }
    )

    return response.data
  } catch (error) {
    // Ensure we clean up any pending connections
    if (axios.isAxiosError(error) && error.request) {
      // Request was made but no response received - connection may be hanging
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.')
      }
    }
    
    if (axios.isAxiosError(error)) {
      // Handle network errors (no response from server)
      if (!error.response) {
        throw new Error('Unable to connect to the server. Please make sure the backend is running at ' + API_BASE_URL)
      }
      
      // FastAPI returns JSON errors, but we requested blob responseType
      // So we need to parse the blob as text first, then as JSON
      if (error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text()
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(text)
            throw new Error(errorData.detail || errorData.message || 'Failed to process document')
          } catch {
            // If not JSON, use the text as error message
            throw new Error(text || 'Failed to process document')
          }
        } catch (parseError) {
          // If parsing fails, use default error message
          throw new Error('Failed to process document. Please check the file format and try again.')
        }
      }
      
      // Handle other error responses
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          `Server error: ${error.response?.status} ${error.response?.statusText}` ||
                          'Failed to process document'
      throw new Error(errorMessage)
    }
    throw error instanceof Error ? error : new Error('An unexpected error occurred')
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}





