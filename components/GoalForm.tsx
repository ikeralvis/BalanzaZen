'use client'

import { useState } from 'react'
import { updateTargetWeight } from '@/app/goals/actions'
import { Loader2 } from 'lucide-react'

export default function GoalForm({ currentTarget }: { currentTarget: number | null }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setMessage('')

        const result = await updateTargetWeight(formData)

        if (result?.error) {
            setMessage('Error: ' + result.error)
        } else {
            setMessage('Meta actualizada')
        }

        setIsLoading(false)
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurar Meta</h2>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="target_weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Peso Objetivo (kg)
                    </label>
                    <input
                        id="target_weight"
                        name="target_weight"
                        type="number"
                        step="0.1"
                        defaultValue={currentTarget || ''}
                        required
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 h-14 text-lg shadow-sm focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                        placeholder="Ej: 75.0"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">{message}</span>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                    >
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Guardar Meta
                    </button>
                </div>
            </form>
        </div>
    )
}
