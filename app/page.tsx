import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardStats from '@/components/DashboardStats'
import Charts from '@/components/Charts'

export default async function Home() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch latest 30 measurements for charts
    const { data: measurements } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30)

    const current = measurements?.[0]
    const previous = measurements?.[1]

    // Calculate monthly progress (Current Weight - First Weight of Month)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Filter measurements starting from the beginning of the month
    // We assume measurements are ordered by date desc, so the last item in this filtered list is the first of the month
    const thisMonthMeasurements = measurements?.filter(m => new Date(m.date) >= startOfMonth) || []
    const firstOfMonth = thisMonthMeasurements[thisMonthMeasurements.length - 1]

    // If we have a previous measurement this month, compare current with it. 
    // If current IS the first of month, we might want to compare with end of last month? 
    // Usually "Monthly Progress" means "Change since start of month".
    const monthlyDiff = (current && firstOfMonth && current.id !== firstOfMonth.id)
        ? current.weight - firstOfMonth.weight
        : (current && measurements && measurements.length > 1 && thisMonthMeasurements.length === 1)
            ? current.weight - measurements[1].weight // If only 1 entry this month, compare with immediate previous from last month for context, or just show 0? 
            // The user wants "progreso del mes". If I weigh 80 today (1st) and 82 yesterday (30th), diff is -2? 
            // Let's stick to strict "This Month" delta. If I only have today's entry, delta is 0.
            : 0

    return (
        <main className="min-h-screen bg-background pb-32 pt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Bienvenido de nuevo
                        </p>
                    </div>
                </div>

                {current && measurements ? (
                    <div className="space-y-8">
                        <DashboardStats
                            current={current}
                            previous={previous}
                            monthlyDiff={Number(monthlyDiff.toFixed(1))} // Ensure precision
                        />

                        <Charts data={measurements} />

                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center bg-muted/10">
                        <h3 className="mt-2 text-sm font-semibold text-foreground">
                            No hay registros
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Empieza registrando tu peso de hoy.
                        </p>
                    </div>
                )}
            </div>

        </main>
    )
}
