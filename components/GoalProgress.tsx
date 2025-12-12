import { Trophy, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { clsx } from 'clsx'

interface GoalProgressProps {
    currentWeight: number
    startWeight: number
    targetWeight: number
}

export default function GoalProgress({ currentWeight, startWeight, targetWeight }: GoalProgressProps) {
    const isWeightLoss = startWeight > targetWeight

    // Calculate progress percentage
    // Total diff to cover: abs(start - target)
    // Covered so far: abs(start - current)
    const totalDiff = Math.abs(startWeight - targetWeight)
    const coveredDiff = Math.abs(startWeight - currentWeight)

    // Clamp percentage between 0 and 100
    let progress = totalDiff === 0 ? 100 : (coveredDiff / totalDiff) * 100
    if (progress > 100) progress = 100
    if (progress < 0) progress = 0

    // Check if we are moving in the right direction
    // For weight loss: current should be < start
    // For weight gain: current should be > start
    const isMovingCorrectly = isWeightLoss ? currentWeight <= startWeight : currentWeight >= startWeight

    // If moving in wrong direction, progress is 0 (or we could show negative, but let's stick to 0 for bar)
    if (!isMovingCorrectly) progress = 0

    const remaining = Math.abs(currentWeight - targetWeight).toFixed(1)

    return (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-500/20 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-yellow-300" />
                    <h3 className="text-lg font-bold">Tu Progreso</h3>
                </div>
                <span className="text-2xl font-bold">{Math.round(progress)}%</span>
            </div>

            <div className="relative mb-6">
                <div className="h-4 w-full overflow-hidden rounded-full bg-black/20">
                    <div
                        className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 flex justify-between text-xs font-medium text-indigo-100">
                    <span>Inicio: {startWeight}kg</span>
                    <span>Meta: {targetWeight}kg</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                    <p className="text-xs text-indigo-200">Peso Actual</p>
                    <p className="text-xl font-bold">{currentWeight} kg</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                    <p className="text-xs text-indigo-200">Falta</p>
                    <p className="text-xl font-bold">{remaining} kg</p>
                </div>
            </div>

            <p className="mt-4 text-center text-sm font-medium text-indigo-100">
                {progress >= 100
                    ? '¡Felicidades! ¡Has alcanzado tu meta! 🎉'
                    : progress >= 50
                        ? '¡Vas muy bien! Ya has superado la mitad. 💪'
                        : '¡Sigue así! Cada paso cuenta. 🌱'
                }
            </p>
        </div>
    )
}
