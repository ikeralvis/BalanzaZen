import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import MeasurementsHistory from '@/components/MeasurementsHistory'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ExportButton from '@/components/ExportButton'
import ThemeToggle from '@/components/ThemeToggle'


export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch measurements history
    const { data: measurements } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    return (
        <main className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-900">
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        Mi Perfil
                    </h1>
                </div>




                <div className="space-y-8">
                    <ProfileForm
                        initialData={{
                            age: profile?.age || null,
                            height: profile?.height || null
                        }}
                    />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ajustes & Datos</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <ThemeToggle />
                            <ExportButton />
                        </div>
                    </div>

                    <MeasurementsHistory initialMeasurements={measurements || []} />
                </div>
            </div>
        </main>
    )
}
