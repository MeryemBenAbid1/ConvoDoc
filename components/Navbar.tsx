'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-xl font-semibold text-white hover:text-gray-200 transition-colors"
          >
            ConvoDoc
          </Link>
        </div>
      </div>
    </nav>
  )
}





