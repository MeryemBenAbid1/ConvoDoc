# Smart Document to Word Converter

A web application built with Next.js and TypeScript for document conversion.

## Features
- Upload PDF or image documents
- Modern responsive UI built with Tailwind CSS
- Simple document upload interface

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tooling**: PostCSS, ESLint

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm (comes with Node.js)

### Installation
```bash
# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Project Structure
- `app/` – Next.js app directory
  - `page.tsx` – Landing page with feature overview and call-to-action
  - `upload/page.tsx` – Document upload flow
  - `processing/page.tsx` – Processing/progress UI
  - `result/page.tsx` – Download page for converted Word files
- `components/` – Reusable UI components (navbar, footer, upload box, progress steps, download card)
- `lib/` – Utility functions

## Scripts
- `npm run dev` – Start development server
- `npm run build` – Create production build
- `npm run start` – Start production server
- `npm run lint` – Run linting
