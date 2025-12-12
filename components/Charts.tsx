'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Measurement {
    weight: number
    bmi: number
    body_fat_percent: number
    fat_mass_kg: number
    muscle_mass_kg: number
    date: string
}

const CustomTooltip = ({ active, payload, label }: any) => { // Using any for recharts ease, optimizing later if needed
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl p-3 shadow-xl ring-1 ring-black/5">
                <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground mr-2">{entry.value}</span>
                        {entry.name}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function Charts({ data }: { data: Measurement[] }) {
    // Reverse data for charts (oldest first)
    const chartData = [...data].reverse().map((item) => ({
        ...item,
        formattedDate: format(new Date(item.date), 'd MMM', { locale: es }),
    }))

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Weight Chart */}
            <div className="rounded-3xl bg-white/50 p-6 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 backdrop-blur-xl">
                <h3 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                    Progreso de Peso
                </h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/20" />
                            <XAxis
                                dataKey="formattedDate"
                                stroke="currentColor"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                className="text-muted-foreground"
                                tickMargin={10}
                            />
                            <YAxis
                                stroke="currentColor"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                className="text-muted-foreground"
                                tickMargin={10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="currentColor"
                                strokeWidth={2}
                                dot={{ fill: 'currentColor', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                name="Peso (kg)"
                                className="text-foreground"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Body Composition Chart */}
            <div className="rounded-3xl bg-white/50 p-6 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 backdrop-blur-xl">
                <h3 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                    Composición Corporal
                </h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/20" />
                            <XAxis
                                dataKey="formattedDate"
                                stroke="currentColor"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                className="text-muted-foreground"
                                tickMargin={10}
                            />
                            <YAxis
                                stroke="currentColor"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                className="text-muted-foreground"
                                tickMargin={10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line
                                type="monotone"
                                dataKey="fat_mass_kg"
                                stroke="#f43f5e" // Rose-500
                                strokeWidth={2}
                                dot={false}
                                name="Grasa (kg)"
                            />
                            <Line
                                type="monotone"
                                dataKey="muscle_mass_kg"
                                stroke="#10b981" // Emerald-500
                                strokeWidth={2}
                                dot={false}
                                name="Músculo (kg)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
