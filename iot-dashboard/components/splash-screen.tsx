"use client"

import { useEffect, useState } from "react"
import { Thermometer, Droplets } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <Thermometer className="w-12 h-12 text-red-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="relative">
            <Droplets className="w-12 h-12 text-blue-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ESP8266 IoT Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Initializing sensor monitoring system...</p>
        </div>

        <div className="w-64 mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{progress}% Complete</p>
        </div>
      </div>
    </div>
  )
}
