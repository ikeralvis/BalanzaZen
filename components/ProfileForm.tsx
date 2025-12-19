'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/profile/actions'
import { Loader2, User } from 'lucide-react'

interface ProfileFormProps {
    initialData: {
        age: number | null
        height: number | null
    }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setMessage('')

        const result = await updateProfile(formData)

        if (result?.error) {
            setMessage('Error: ' + result.error)
        } else {
            setMessage('Perfil actualizado')
        }

        setIsLoading(false)
    }

    return (
        <form action={handleSubmit} className="rounded-2xl bg-white/5 backdrop-blur-xl p-5 border border-white/10 ring-1 ring-white/5 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Datos Personales</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="age" className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Edad
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        defaultValue={initialData.age || ''}
                        required
                        className="block w-full rounded-xl border border-white/10 bg-white/5 h-12 px-4 text-lg shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>
                <div>
                    <label htmlFor="height" className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Altura (cm)
                    </label>
                    <input
                        id="height"
                        name="height"
                        type="number"
                        defaultValue={initialData.height || ''}
                        required
                        className="block w-full rounded-xl border border-white/10 bg-white/5 h-12 px-4 text-lg shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
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
    )
}
