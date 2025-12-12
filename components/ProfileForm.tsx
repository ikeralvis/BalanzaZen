'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/profile/actions'
import { Loader2 } from 'lucide-react'

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
            setMessage('Perfil actualizado correctamente')
        }

        setIsLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Datos Personales</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Edad
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        defaultValue={initialData.age || ''}
                        required
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 h-14 text-lg shadow-sm focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Altura (cm)
                    </label>
                    <input
                        id="height"
                        name="height"
                        type="number"
                        defaultValue={initialData.height || ''}
                        required
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 h-14 text-lg shadow-sm focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-green-600 font-medium">{message}</span>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </button>
            </div>
        </form>
    )
}
