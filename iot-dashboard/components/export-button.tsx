"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Loader } from "./loader"

interface ExportButtonProps {
  onExport: () => Promise<void>
  disabled?: boolean
}

export function ExportButton({ onExport, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={disabled || isExporting} variant="outline" size="sm">
      {isExporting ? <Loader size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  )
}
