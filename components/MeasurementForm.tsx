'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X, Calendar, Scale, Activity, Percent, Dumbbell } from 'lucide-react'

export default function MeasurementForm({ userId, mode = 'floating' }: { userId: string, mode?: 'floating' | 'navbar' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Ensure we're on the client before using portal
    useEffect(() => {
        setMounted(true)
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const dateInput = formData.get('date') as string

        const data = {
            user_id: userId,
            weight: Number.parseFloat(formData.get('weight') as string),
            bmi: Number.parseFloat(formData.get('bmi') as string),
            body_fat_percent: Number.parseFloat(formData.get('body_fat_percent') as string),
            fat_mass_kg: Number.parseFloat(formData.get('fat_mass_kg') as string),
            muscle_mass_kg: Number.parseFloat(formData.get('muscle_mass_kg') as string),
            date: dateInput || new Date().toISOString().split('T')[0],
        }

        const { error } = await supabase.from('measurements').insert(data)

        if (error) {
            alert('Error al guardar: ' + error.message)
        } else {
            setIsOpen(false)
            router.refresh()
        }
        setIsLoading(false)
    }

    // Don't render modal until mounted (client-side)
    if (!isOpen || !mounted) {
        if (mode === 'navbar') {
            return (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
                    aria-label="Añadir registro"
                >
                    <Plus className="h-5 w-5" />
                </button>
            )
        }
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl shadow-black/20 transition-transform hover:scale-105 active:scale-95 sm:bottom-8"
                aria-label="Añadir registro"
            >
                <Plus className="h-6 w-6" />
            </button>
        )
    }

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/95"
                onClick={() => setIsOpen(false)}
            />
            
            {/* Modal positioning wrapper */}
            <div className="fixed inset-0 flex min-h-full items-center justify-center p-4">
                <div 
                    className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Nuevo Registro
                            </h2>
                            <p className="text-sm text-zinc-400 mt-0.5">
                                Actualiza tu progreso
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Date */}
                        <div className="space-y-1.5">
                            <label htmlFor="date" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                Fecha
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Calendar className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 h-11 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Weight */}
                        <div className="space-y-1.5">
                            <label htmlFor="weight" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                Peso (kg)
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Scale className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    id="weight"
                                    name="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    required
                                    className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 h-12 text-lg font-medium text-white focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        {/* Grid for other inputs */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label htmlFor="bmi" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                    IMC
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Activity className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        id="bmi"
                                        name="bmi"
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        required
                                        className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 h-11 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="body_fat_percent" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                    Grasa (%)
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Percent className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        id="body_fat_percent"
                                        name="body_fat_percent"
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        required
                                        className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 h-11 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="fat_mass_kg" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                    M. Grasa (kg)
                                </label>
                                <input
                                    id="fat_mass_kg"
                                    name="fat_mass_kg"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    required
                                    className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 h-11 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="muscle_mass_kg" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                    Músculo (kg)
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Dumbbell className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        id="muscle_mass_kg"
                                        name="muscle_mass_kg"
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        required
                                        className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 h-11 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex justify-center items-center rounded-xl bg-white text-zinc-900 px-4 py-3 text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

    // Use portal to render modal at document body level
    return createPortal(modalContent, document.body)
}
