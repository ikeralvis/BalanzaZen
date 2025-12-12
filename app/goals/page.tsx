import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoalForm from '@/components/GoalForm'
import GoalProgress from '@/components/GoalProgress'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function GoalsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile for target weight
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch measurements (to get start and current)
    // We fetch all to find the first one? Or just order by date asc limit 1 and desc limit 1.
    // Let's fetch all (limited to say 1000, assuming not huge yet) or use separate queries.
    // Efficient: 
    // 1. Current: order date desc limit 1
    // 2. Start: order date asc limit 1

    // Current
    const { data: latest } = await supabase
        .from('measurements')
        .select('weight, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single()

    // Start
    const { data: oldest } = await supabase
        .from('measurements')
        .select('weight, date')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(1)
        .single()

    const targetWeight = profile?.target_weight
    const currentWeight = latest?.weight
    const startWeight = oldest?.weight

    return (
        <main className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900">
            <div className="mx-auto max-w-lg px-4 py-8">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        Mis Metas
                    </h1>
                </div>

                <div className="space-y-6">
                    {targetWeight && currentWeight && startWeight ? (
                        <GoalProgress
                            currentWeight={currentWeight}
                            startWeight={startWeight}
                            targetWeight={targetWeight}
                        />
                    ) : (
                        <div className="rounded-xl bg-indigo-50 p-6 text-center dark:bg-indigo-900/30">
                            <p className="text-indigo-800 dark:text-indigo-200">
                                {!currentWeight
                                    ? 'Añade tu primer registro de peso para ver tu progreso.'
                                    : 'Configura una meta de peso para empezar.'}
                            </p>
                        </div>
                    )}

                    <GoalForm currentTarget={targetWeight || null} />
                </div>
            </div>
        </main>
    )
}
