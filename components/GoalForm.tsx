'use client'

import { useState } from 'react'
import { updateTargetWeight } from '@/app/goals/actions'
import { Loader2, Target } from 'lucide-react'

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
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl p-5 border border-white/10 ring-1 ring-white/5">
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Configurar Meta</h2>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="target_weight" className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Peso Objetivo (kg)
                    </label>
                    <input
                        id="target_weight"
                        name="target_weight"
                        type="number"
                        step="0.1"
                        defaultValue={currentTarget || ''}
                        required
                        className="block w-full rounded-xl border border-white/10 bg-white/5 h-12 px-4 text-lg shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="Ej: 75.0"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-500 font-medium">{message}</span>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center items-center rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}
