import { Trophy, ArrowDown, ArrowUp } from 'lucide-react'

interface GoalProgressProps {
    currentWeight: number
    startWeight: number
    targetWeight: number
}

export default function GoalProgress({ currentWeight, startWeight, targetWeight }: GoalProgressProps) {
    const isWeightLoss = startWeight > targetWeight

    // Calculate progress percentage
    const totalDiff = Math.abs(startWeight - targetWeight)
    const coveredDiff = Math.abs(startWeight - currentWeight)

    let progress = totalDiff === 0 ? 100 : (coveredDiff / totalDiff) * 100
    if (progress > 100) progress = 100
    if (progress < 0) progress = 0

    const isMovingCorrectly = isWeightLoss ? currentWeight <= startWeight : currentWeight >= startWeight
    if (!isMovingCorrectly) progress = 0

    const remaining = Math.abs(currentWeight - targetWeight).toFixed(1)

    return (
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-6 text-background shadow-2xl">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl opacity-50" />
            
            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <h3 className="text-lg font-bold">Tu Progreso</h3>
                    </div>
                    <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                </div>

                <div className="relative mb-5">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-emerald-400 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-medium opacity-70">
                        <span>Inicio: {startWeight}kg</span>
                        <span>Meta: {targetWeight}kg</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                        <p className="text-xs opacity-70">Peso Actual</p>
                        <p className="text-xl font-bold">{currentWeight} kg</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                        <p className="text-xs opacity-70">Falta</p>
                        <div className="flex items-center gap-1">
                            <p className="text-xl font-bold">{remaining} kg</p>
                            {isWeightLoss ? (
                                <ArrowDown className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <ArrowUp className="w-4 h-4 text-emerald-400" />
                            )}
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm font-medium opacity-80">
                    {progress >= 100
                        ? '¡Felicidades! ¡Has alcanzado tu meta! 🎉'
                        : progress >= 50
                            ? '¡Vas muy bien! Ya has superado la mitad. 💪'
                            : '¡Sigue así! Cada paso cuenta. 🌱'
                    }
                </p>
            </div>
        </div>
    )
}
