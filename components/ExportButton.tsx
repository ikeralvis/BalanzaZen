'use client'

import { useState } from 'react'
import { getMeasurementsForExport } from '@/app/profile/actions'
import { Download, Loader2, FileText } from 'lucide-react'
import { cn } from '@/utils/cn'

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
            className={cn(
                "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white/5 p-4 text-sm font-medium text-foreground ring-1 ring-inset ring-black/5 transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10",
                "glass shadow-sm"
            )}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Download className="h-5 w-5" />
                )}
            </div>
            <div className="flex flex-col items-start gap-0.5">
                <span className="text-base font-semibold">Exportar Datos</span>
                <span className="text-xs text-muted-foreground">Formato CSV para Excel/Sheets</span>
            </div>
        </button>
    )
}
