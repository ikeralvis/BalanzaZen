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
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de Registros</h2>
            </div>
            <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Fecha</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Peso</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Grasa %</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {measurements.map((m) => (
                            <tr key={m.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {format(new Date(m.date), 'd MMM yyyy', { locale: es })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {m.weight} kg
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {m.body_fat_percent}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(m.id)}
                                        disabled={isDeleting === m.id}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {measurements.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500">
                        No hay registros disponibles.
                    </div>
                )}
            </div>
        </div>
    )
}
