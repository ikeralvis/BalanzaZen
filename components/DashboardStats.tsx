import { ArrowDown, ArrowUp, Minus, TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Measurement {
    weight: number
    bmi: number
    body_fat_percent: number
    fat_mass_kg: number
    muscle_mass_kg: number
    date: string
}

interface StatCardProps {
    label: string
    value: number
    unit: string
    prevValue?: number
    inverse?: boolean // If true, lower is better (e.g. fat)
}

function StatCard({ label, value, unit, prevValue, inverse = false }: StatCardProps) {
    const diff = prevValue ? value - prevValue : 0
    const isPositive = diff > 0
    const isNegative = diff < 0
    const isNeutral = diff === 0

    // Determine color based on whether increase is good or bad
    let trendColor = 'text-muted-foreground'
    if (!isNeutral) {
        if (inverse) {
            trendColor = isNegative ? 'text-emerald-500' : 'text-rose-500'
        } else {
            trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500'
        }
    }

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl p-5 border border-white/10 ring-1 ring-white/5 transition-all hover:bg-white/10">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
            </dt>
            <dd className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                    {value}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
                </span>
                {prevValue !== undefined && (
                    <span
                        className={cn(
                            'flex items-center text-xs font-medium px-2 py-1 rounded-full bg-white/5',
                            trendColor
                        )}
                    >
                        {isPositive && <ArrowUp className="mr-1 h-3 w-3" />}
                        {isNegative && <ArrowDown className="mr-1 h-3 w-3" />}
                        {isNeutral && <Minus className="mr-1 h-3 w-3" />}
                        {Math.abs(diff).toFixed(1)}
                    </span>
                )}
            </dd>
        </div>
    )
}

export default function DashboardStats({
    current,
    previous,
    monthlyDiff = 0,
}: {
    current: Measurement
    previous?: Measurement
    monthlyDiff?: number
}) {
    // const isMonthlyNegative = monthlyDiff < 0

    return (
        <div className="space-y-6">
            {/* Global Progress Card */}
            <div className="relative overflow-hidden rounded-3xl bg-foreground p-6 sm:p-8 text-background shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl opacity-50" />

                <div className="relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Progreso este mes
                            </p>
                            <div className="mt-3 flex items-baseline gap-1">
                                <span className="text-4xl sm:text-5xl font-bold tracking-tighter">
                                    {Math.abs(monthlyDiff).toFixed(1)}
                                </span>
                                <span className="text-lg sm:text-xl font-medium opacity-60">kg</span>
                            </div>
                        </div>
                        <div className={cn("rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur-sm", monthlyDiff === 0 && "opacity-50")}>
                            {monthlyDiff < 0 ? (
                                <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
                            ) : monthlyDiff > 0 ? (
                                <ArrowUp className="h-6 w-6 sm:h-8 sm:w-8 text-rose-400" />
                            ) : (
                                <Minus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            )}
                        </div>
                    </div>
                    <p className="mt-4 sm:mt-6 text-sm font-medium opacity-70">
                        {monthlyDiff < 0
                            ? 'Has bajado de peso. ¡Sigue así!'
                            : monthlyDiff > 0
                                ? 'Has subido de peso.'
                                : 'Te has mantenido igual.'}
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                <StatCard
                    label="Peso"
                    value={current.weight}
                    prevValue={previous?.weight}
                    unit="kg"
                    inverse
                />
                <StatCard
                    label="IMC"
                    value={current.bmi}
                    prevValue={previous?.bmi}
                    unit=""
                    inverse
                />
                <StatCard
                    label="Grasa"
                    value={current.body_fat_percent}
                    prevValue={previous?.body_fat_percent}
                    unit="%"
                    inverse
                />
                <StatCard
                    label="M. Grasa"
                    value={current.fat_mass_kg}
                    prevValue={previous?.fat_mass_kg}
                    unit="kg"
                    inverse
                />
                <StatCard
                    label="Músculo"
                    value={current.muscle_mass_kg}
                    prevValue={previous?.muscle_mass_kg}
                    unit="kg"
                />
            </div>
        </div>
    )
}
