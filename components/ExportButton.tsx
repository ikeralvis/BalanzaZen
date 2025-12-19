'use client'

import { useState } from 'react'
import { getMeasurementsForExport } from '@/app/profile/actions'
import { Download, Loader2 } from 'lucide-react'

export default function ExportButton({ range = 'all' }: { range?: string }) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleExport() {
        setIsLoading(true)
        try {
            const { data, error } = await getMeasurementsForExport(range)

            if (error || !data) {
                alert('Error al exportar datos')
                return
            }

            // Convert to CSV
            const headers = ['Fecha', 'Peso (kg)', 'IMC', 'Grasa (%)', 'Masa Grasa (kg)', 'Masa Muscular (kg)']
            const csvContent = [
                headers.join(','),
                ...data.map(row => [
                    row.date,
                    row.weight,
                    row.bmi,
                    row.body_fat_percent,
                    row.fat_mass_kg,
                    row.muscle_mass_kg
                ].join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            link.setAttribute('download', `health_tracker_${range}_${new Date().toISOString().split('T')[0]}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            link.remove() // Fix: childNode.remove()
        } catch (e) {
            console.error(e)
            alert('Error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            Exportar CSV
        </button>
    )
}
