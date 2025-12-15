'use client'

interface DownloadCardProps {
  pagesProcessed: number
  languagesDetected: string[]
  layoutElementsFound: number
  onDownload: () => void
  onProcessAnother: () => void
}

export default function DownloadCard({
  pagesProcessed,
  languagesDetected,
  layoutElementsFound,
  onDownload,
  onProcessAnother,
}: DownloadCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
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
      </div>

      {/* Success Message */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
        Conversion Complete!
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Your document has been successfully converted to Word format.
      </p>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{pagesProcessed}</p>
          <p className="text-xs text-gray-500 mt-1">Pages Processed</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {languagesDetected.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Languages Detected</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {layoutElementsFound}
          </p>
          <p className="text-xs text-gray-500 mt-1">Layout Elements</p>
        </div>
      </div>

      {/* Languages List */}
      {languagesDetected.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Languages Detected:
          </p>
          <div className="flex flex-wrap gap-2">
            {languagesDetected.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onDownload}
          className="flex-1 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Download Word File
        </button>
        <button
          onClick={onProcessAnother}
          className="flex-1 px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          Process Another Document
        </button>
      </div>
    </div>
  )
}





