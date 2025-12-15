'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Convert Any Document
            <br />
            <span className="text-gray-600">Into Editable Word</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Smart document conversion system that transforms PDFs and images
            into fully editable Word documents with preserved formatting.
          </p>

          <Link
            href="/upload"
            className="inline-flex justify-center items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 text-base sm:text-lg mt-12"
          >
            Upload Document
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload</h3>
            <p className="text-gray-600">
              Upload your PDF or image file.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Process</h3>
            <p className="text-gray-600">
              Layout detection and OCR reconstruction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Download</h3>
            <p className="text-gray-600">
              Get your editable Word document.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-50 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to convert your documents?
          </h2>
          <Link
            href="/upload"
            className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
