'use client'

import { useState } from 'react'
import { deleteMeasurement } from '@/app/profile/actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

interface Measurement {
    id: number
    weight: number
    bmi: number
    body_fat_percent: number
    date: string
}

export default function MeasurementsHistory({ initialMeasurements }: { initialMeasurements: Measurement[] }) {
    const [measurements, setMeasurements] = useState(initialMeasurements)
    const [isDeleting, setIsDeleting] = useState<number | null>(null)

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de querer eliminar este registro?')) return

        setIsDeleting(id)
        const result = await deleteMeasurement(id)

        if (result?.success) {
            setMeasurements(measurements.filter(m => m.id !== id))
        } else {
            alert('Error al eliminar: ' + result?.error)
        }
        setIsDeleting(null)
    }

    return (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/10">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Historial de Registros</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha</th>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Peso</th>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Grasa %</th>
                            <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {measurements.map((m) => (
                            <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-foreground">
                                    {format(new Date(m.date), 'd MMM yyyy', { locale: es })}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-foreground">
                                    {m.weight} kg
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-foreground">
                                    {m.body_fat_percent}%
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(m.id)}
                                        disabled={isDeleting === m.id}
                                        className="text-rose-500 hover:text-rose-400 disabled:opacity-50 transition-colors bg-rose-500/10 p-2 rounded-full"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {measurements.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        No hay registros disponibles.
                    </div>
                )}
            </div>
        </div>
    )
}
