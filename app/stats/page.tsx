import { createClient } from '@/utils/supabase/server'
import Charts from '@/components/Charts'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import ExportButton from '@/components/ExportButton'

export default async function StatsPage({ searchParams }: { searchParams: { range?: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Default range is 'all' if not specified
    // range: '1m' | '3m' | '6m' | '1y' | 'all'
    const range = searchParams.range || '1m'

    let startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    switch (range) {
        case '1m':
            startDate.setMonth(startDate.getMonth() - 1)
            break
        case '3m':
            startDate.setMonth(startDate.getMonth() - 3)
            break
        case '6m':
            startDate.setMonth(startDate.getMonth() - 6)
            break
        case '1y':
            startDate.setFullYear(startDate.getFullYear() - 1)
            break
        case 'all':
            startDate = new Date(0) // Beginning of time
            break
        default:
            startDate.setMonth(startDate.getMonth() - 1)
    }

    const { data: measurements } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: false })

    const FilterLink = ({ r, label }: { r: string, label: string }) => (
        <Link
            href={`/stats?range=${r}`}
            className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
                range === r
                    ? "bg-foreground text-background shadow-lg scale-105"
                    : "text-muted-foreground hover:bg-muted"
            )}
        >
            {label}
        </Link>
    )

    return (
        <main className="min-h-screen bg-background pb-32 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Progreso Global
                            </h1>
                            <p className="mt-2 text-muted-foreground leading-relaxed max-w-lg">
                                Analiza tu evolución a lo largo del tiempo y exporta tus datos.
                            </p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <ExportButton range={range} />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto">
                        <FilterLink r="1m" label="1 Mes" />
                        <FilterLink r="3m" label="3 Meses" />
                        <FilterLink r="6m" label="6 Meses" />
                        <FilterLink r="1y" label="1 Año" />
                        <FilterLink r="all" label="Todo" />
                    </div>
                </div>

                {/* Charts */}
                {measurements && measurements.length > 0 ? (
                    <Charts data={measurements} />
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-border p-8 text-center animate-in fade-in">
                        <div className="max-w-xs space-y-2">
                            <p className="text-lg font-medium text-foreground">No hay datos</p>
                            <p className="text-sm text-muted-foreground">
                                No se encontraron registros en este periodo. Intenta cambiar el filtro o añade nuevos registros.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
