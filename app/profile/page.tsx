import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import MeasurementsHistory from '@/components/MeasurementsHistory'
import ExportButton from '@/components/ExportButton'


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
        <main className="min-h-screen bg-background pb-32 pt-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Perfil
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestiona tus datos y configuración
                    </p>
                </div>

                <div className="space-y-4">
                    <ProfileForm
                        initialData={{
                            age: profile?.age || null,
                            height: profile?.height || null
                        }}
                    />

                    <div className="rounded-2xl bg-white/5 backdrop-blur-xl p-5 border border-white/10 ring-1 ring-white/5">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">Exportar Datos</h3>
                        <ExportButton />
                    </div>

                    <MeasurementsHistory initialMeasurements={measurements || []} />
                </div>
            </div>
        </main>
    )
}
