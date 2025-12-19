import { createClient } from '@/utils/supabase/server'
import Charts from '@/components/Charts'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import ExportButton from '@/components/ExportButton'
import { calculateTrend, predictGoalDate } from '@/utils/analysis'
import { ArrowDown, ArrowUp, Minus, TrendingUp, Scale, Activity, Dumbbell } from 'lucide-react'

export default async function StatsPage(props: { searchParams: Promise<{ range?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Default range is '1m' if not specified
    // range: '1m' | '3m' | '6m' | '1y' | 'all'
    const range = searchParams.range || '1m'

    // Get current date parts in local timezone
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() // 0-indexed

    let startDateStr = ''
    let periodLabel = 'Este mes'

    switch (range) {
        case '1m':
            // Start of current month (e.g., December 1st) - format YYYY-MM-01
            startDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
            periodLabel = 'Este mes'
            break
        case '3m':
            // Start of 3 months ago
            {
                const startMonth = currentMonth - 2
                const startYear = startMonth < 0 ? currentYear - 1 : currentYear
                const adjustedMonth = startMonth < 0 ? 12 + startMonth : startMonth
                startDateStr = `${startYear}-${String(adjustedMonth + 1).padStart(2, '0')}-01`
            }
            periodLabel = 'Últimos 3 meses'
            break
        case '6m':
            // Start of 6 months ago
            {
                const startMonth = currentMonth - 5
                const startYear = startMonth < 0 ? currentYear - 1 : currentYear
                const adjustedMonth = startMonth < 0 ? 12 + startMonth : startMonth
                startDateStr = `${startYear}-${String(adjustedMonth + 1).padStart(2, '0')}-01`
            }
            periodLabel = 'Últimos 6 meses'
            break
        case '1y':
            // Start of year
            startDateStr = `${currentYear}-01-01`
            periodLabel = 'Este año'
            break
        case 'all':
            startDateStr = '1970-01-01'
            periodLabel = 'Todo el tiempo'
            break
        default:
            startDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
            periodLabel = 'Este mes'
    }

    const { data: measurements } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .order('date', { ascending: false })

    const { data: profileData } = await supabase
        .from('profiles')
        .select('target_weight')
        .eq('id', user.id)

    const FilterLink = ({ r, label }: { r: string, label: string }) => (
        <Link
            href={`/stats?range=${r}`}
            className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
                range === r
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:bg-white/10"
            )}
        >
            {label}
        </Link>
    )

    // Calculate statistics for the selected period
    const latest = measurements?.[0]
    const oldest = measurements?.[measurements?.length - 1]
    
    // Period changes
    const weightChange = latest && oldest && measurements && measurements.length > 1 
        ? Number((latest.weight - oldest.weight).toFixed(1)) : 0
    const fatChange = latest && oldest && measurements && measurements.length > 1 
        ? Number((latest.fat_mass_kg - oldest.fat_mass_kg).toFixed(1)) : 0
    const muscleChange = latest && oldest && measurements && measurements.length > 1 
        ? Number((latest.muscle_mass_kg - oldest.muscle_mass_kg).toFixed(1)) : 0
    const bmiChange = latest && oldest && measurements && measurements.length > 1 
        ? Number((latest.bmi - oldest.bmi).toFixed(1)) : 0

    // Prediction Logic
    const profileDataLine = profileData ? profileData[0] : null
    const goalWeight = profileDataLine?.target_weight

    // Calculate Trend
    const trendData = measurements?.map(m => ({ date: m.date, value: m.weight })) || []
    const dailyRate = calculateTrend(trendData)

    // Predict Date
    let predictionText = "---"
    let predictionSub = "Define una meta"
    let showPrediction = false

    if (goalWeight && dailyRate !== null && dailyRate !== 0 && latest) {
        const predictedDate = predictGoalDate(latest.weight, goalWeight, dailyRate)
        if (predictedDate) {
            showPrediction = true
            const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
            predictionText = predictedDate.toLocaleDateString('es-ES', options)
            const weeksLeft = Math.ceil((predictedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7))
            predictionSub = `~${weeksLeft} semana${weeksLeft !== 1 ? 's' : ''}`
        } else {
            predictionSub = dailyRate > 0 ? "Tendencia opuesta" : "Tendencia opuesta"
        }
    } else if (!goalWeight) {
        predictionSub = "Define una meta"
    } else {
        predictionSub = "Necesitas más datos"
    }

    const StatCard = ({ label, value, unit, inverse = false, icon: Icon }: { 
        label: string, 
        value: number, 
        unit: string, 
        inverse?: boolean,
        icon?: React.ComponentType<{ className?: string }>
    }) => {
        const isPositive = value > 0
        const isNegative = value < 0
        let color = "text-muted-foreground"
        if (value !== 0) {
            if (inverse) color = isNegative ? "text-emerald-500" : "text-rose-500"
            else color = isPositive ? "text-emerald-500" : "text-rose-500"
        }

        return (
            <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl p-5 border border-white/10 ring-1 ring-white/5 transition-all hover:bg-white/10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className={cn("text-2xl font-bold tracking-tight", color)}>
                                {value > 0 ? '+' : ''}{value}
                            </span>
                            <span className="text-sm text-muted-foreground">{unit}</span>
                        </div>
                    </div>
                    {Icon && (
                        <div className={cn("p-2 rounded-xl", value === 0 ? "bg-muted/30" : inverse 
                            ? (isNegative ? "bg-emerald-500/10" : "bg-rose-500/10")
                            : (isPositive ? "bg-emerald-500/10" : "bg-rose-500/10"))}>
                            {value === 0 ? (
                                <Minus className="w-4 h-4 text-muted-foreground" />
                            ) : inverse ? (
                                isNegative ? <ArrowDown className="w-4 h-4 text-emerald-500" /> : <ArrowUp className="w-4 h-4 text-rose-500" />
                            ) : (
                                isPositive ? <ArrowUp className="w-4 h-4 text-emerald-500" /> : <ArrowDown className="w-4 h-4 text-rose-500" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background pb-32 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Progreso
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Analiza tu evolución y exporta tus datos
                            </p>
                        </div>
                        <ExportButton range={range} />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-1 bg-white/5 backdrop-blur-xl p-1 rounded-full border border-white/10 overflow-x-auto">
                        <FilterLink r="1m" label="1 Mes" />
                        <FilterLink r="3m" label="3 Meses" />
                        <FilterLink r="6m" label="6 Meses" />
                        <FilterLink r="1y" label="1 Año" />
                        <FilterLink r="all" label="Todo" />
                    </div>
                </div>

                {/* Main Stats Hero */}
                {measurements && measurements.length > 1 && (
                    <div className="relative overflow-hidden rounded-3xl bg-foreground p-6 sm:p-8 text-background shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl opacity-50" />

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 opacity-70" />
                                <p className="text-sm font-medium opacity-80">{periodLabel}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                <div>
                                    <p className="text-xs opacity-60 uppercase tracking-wide">Peso</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className={cn("text-3xl sm:text-4xl font-bold tracking-tighter", 
                                            weightChange < 0 ? "text-emerald-400" : weightChange > 0 ? "text-rose-400" : "")}>
                                            {weightChange > 0 ? '+' : ''}{weightChange}
                                        </span>
                                        <span className="text-sm opacity-60">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs opacity-60 uppercase tracking-wide">Grasa</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className={cn("text-3xl sm:text-4xl font-bold tracking-tighter",
                                            fatChange < 0 ? "text-emerald-400" : fatChange > 0 ? "text-rose-400" : "")}>
                                            {fatChange > 0 ? '+' : ''}{fatChange}
                                        </span>
                                        <span className="text-sm opacity-60">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs opacity-60 uppercase tracking-wide">Músculo</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className={cn("text-3xl sm:text-4xl font-bold tracking-tighter",
                                            muscleChange > 0 ? "text-emerald-400" : muscleChange < 0 ? "text-rose-400" : "")}>
                                            {muscleChange > 0 ? '+' : ''}{muscleChange}
                                        </span>
                                        <span className="text-sm opacity-60">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs opacity-60 uppercase tracking-wide">IMC</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className={cn("text-3xl sm:text-4xl font-bold tracking-tighter",
                                            bmiChange < 0 ? "text-emerald-400" : bmiChange > 0 ? "text-rose-400" : "")}>
                                            {bmiChange > 0 ? '+' : ''}{bmiChange}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Stats Grid */}
                {measurements && measurements.length > 1 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Cambio de Peso" value={weightChange} unit="kg" inverse icon={Scale} />
                        <StatCard label="Cambio de Grasa" value={fatChange} unit="kg" inverse icon={Activity} />
                        <StatCard label="Cambio de Músculo" value={muscleChange} unit="kg" icon={Dumbbell} />
                        <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl p-5 border border-white/10 ring-1 ring-white/5 transition-all hover:bg-white/10">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Meta estimada</p>
                            <p className="text-lg font-bold tracking-tight text-foreground mt-2">{predictionText}</p>
                            <p className="text-xs text-muted-foreground mt-1">{predictionSub}</p>
                        </div>
                    </div>
                )}

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
