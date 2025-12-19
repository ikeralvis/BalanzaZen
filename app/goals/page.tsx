import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoalForm from '@/components/GoalForm'
import GoalProgress from '@/components/GoalProgress'

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
        <main className="min-h-screen bg-background pb-32 pt-20">
            <div className="mx-auto max-w-lg px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Metas
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Define y sigue tu objetivo de peso
                    </p>
                </div>

                <div className="space-y-4">
                    {targetWeight && currentWeight && startWeight ? (
                        <GoalProgress
                            currentWeight={currentWeight}
                            startWeight={startWeight}
                            targetWeight={targetWeight}
                        />
                    ) : (
                        <div className="rounded-2xl bg-white/5 backdrop-blur-xl p-6 text-center border border-white/10">
                            <p className="text-muted-foreground text-sm">
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
