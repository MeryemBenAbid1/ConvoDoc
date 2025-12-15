'use client'

import { useEffect, useState } from 'react'

interface Step {
  id: string
  label: string
}

interface ProgressStepsProps {
  currentStep: number
  steps: Step[]
}

export default function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (currentStep > 0) {
      setCompletedSteps(Array.from({ length: currentStep }, (_, i) => i))
    }
  }, [currentStep])

  const isCompleted = (index: number) => completedSteps.includes(index)
  const isActive = (index: number) => index === currentStep
  const isPending = (index: number) => index > currentStep

  return (
    <div className="w-full">
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Step circle */}
                <div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isCompleted(index)
                      ? 'bg-green-500 border-green-500'
                      : isActive(index)
                      ? 'bg-blue-500 border-blue-500 animate-pulse'
                      : 'bg-white border-gray-300'
                    }
                  `}
                >
                  {isCompleted(index) ? (
                    <svg
                      className="w-5 h-5 text-white"
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
                  ) : isActive(index) ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-2 transition-all duration-300
                      ${isCompleted(index) ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>
              {/* Step label */}
              <p
                className={`
                  mt-3 text-xs font-medium text-center transition-colors duration-300
                  ${isActive(index)
                    ? 'text-blue-600'
                    : isCompleted(index)
                    ? 'text-green-600'
                    : 'text-gray-400'
                  }
                `}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-start gap-4">
            {/* Step circle */}
            <div
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 flex-shrink-0 z-10 bg-white
                ${isCompleted(index)
                  ? 'bg-green-500 border-green-500'
                  : isActive(index)
                  ? 'bg-blue-500 border-blue-500 animate-pulse'
                  : 'bg-white border-gray-300'
                }
              `}
            >
              {isCompleted(index) ? (
                <svg
                  className="w-5 h-5 text-white"
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
              ) : isActive(index) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              )}
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  absolute left-5 top-10 w-0.5 h-8 transition-all duration-300 z-0
                  ${isCompleted(index) ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
            {/* Step label */}
            <div className="flex-1 pt-2">
              <p
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${isActive(index)
                    ? 'text-blue-600'
                    : isCompleted(index)
                    ? 'text-green-600'
                    : 'text-gray-400'
                  }
                `}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

