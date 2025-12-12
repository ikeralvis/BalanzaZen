'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X, Calendar, Scale, Activity, Percent, Dumbbell } from 'lucide-react'
import { cn } from '@/utils/cn' // Assuming we might need this, or I'll just use standard template literals if cn isn't there. Actually I'll stick to standard strings if I don't see utils/cn.
// Checking file list earlier, utils/cn wasn't explicitly seen, but often standard. I'll check my earlier file list.
// utils/supabase exists. I'll stick to template literals or simple conditionals to be safe.

export default function MeasurementForm({ userId, mode = 'floating' }: { userId: string, mode?: 'floating' | 'navbar' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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

    if (!isOpen) {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-all animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-background/80 backdrop-blur-xl border border-white/20 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200 p-0">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/50 p-6">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            Nuevo Registro
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Actualiza tu progreso de hoy
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Date */}
                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium text-foreground">
                            Fecha
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="block w-full rounded-xl border border-border bg-muted/50 pl-10 h-12 text-sm shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-colors outline-none text-foreground"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label htmlFor="weight" className="text-sm font-medium text-foreground">
                                Peso (kg)
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Scale className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id="weight"
                                    name="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    required
                                    className="block w-full rounded-xl border border-border bg-muted/50 pl-10 h-12 text-lg font-medium shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-colors outline-none text-foreground placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="bmi" className="text-sm font-medium text-foreground">
                                IMC
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id="bmi"
                                    name="bmi"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    required
                                    className="block w-full rounded-xl border border-border bg-muted/50 pl-10 h-12 text-base shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-colors outline-none text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="body_fat_percent" className="text-sm font-medium text-foreground">
                                Grasa (%)
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id="body_fat_percent"
                                    name="body_fat_percent"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    required
                                    className="block w-full rounded-xl border border-border bg-muted/50 pl-10 h-12 text-base shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-colors outline-none text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="fat_mass_kg" className="text-sm font-medium text-foreground">
                                Masa Grasa (kg)
                            </label>
                            <input
                                id="fat_mass_kg"
                                name="fat_mass_kg"
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                required
                                className="block w-full rounded-xl border border-border bg-muted/50 px-3 h-12 text-base shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-colors outline-none text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="muscle_mass_kg" className="text-sm font-medium text-foreground">
                                Masa Muscular (kg)
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id="muscle_mass_kg"
                                    name="muscle_mass_kg"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    required
                                    className="block w-full rounded-xl border border-border bg-muted/50 pl-10 h-12 text-base shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-colors outline-none text-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 rounded-xl bg-muted px-4 py-3.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] flex justify-center items-center rounded-xl bg-foreground text-background px-4 py-3.5 text-sm font-medium shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
