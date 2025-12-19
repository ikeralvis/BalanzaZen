export type DataPoint = {
    date: string
    value: number
}

// Calculate the slope (rate of change per day) using Linear Regression
export function calculateTrend(data: DataPoint[]) {
    if (data.length < 2) return null

    const n = data.length
    // Convert dates to timestamps (days since epoch/start) for calculation
    // We'll normalize to "Days since First Point" to keep numbers small
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const firstTime = new Date(sorted[0].date).getTime()

    const points = sorted.map(d => ({
        x: (new Date(d.date).getTime() - firstTime) / (1000 * 60 * 60 * 24), // Days
        y: d.value
    }))

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
    for (const p of points) {
        sumX += p.x
        sumY += p.y
        sumXY += p.x * p.y
        sumX2 += p.x * p.x
    }

    // Slope (m) = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX^2)
    const numerator = (n * sumXY) - (sumX * sumY)
    const denominator = (n * sumX2) - (sumX * sumX)

    if (denominator === 0) return 0 // Vertical line or single point logic error

    const slope = numerator / denominator // Change in Y per unit X (day)
    return slope
}

// Predict date to reach goal
export function predictGoalDate(currentWeight: number, goalWeight: number, dailyRate: number): Date | null {
    // If rate is 0 or going in wrong direction, return null
    // Assuming weight loss: current > goal. Rate should be negative.
    // Assuming weight gain: current < goal. Rate should be positive.

    const isWeightLoss = currentWeight > goalWeight

    // If we are already there
    if (currentWeight === goalWeight) return new Date()

    // Wrong direction checks
    if (isWeightLoss && dailyRate >= 0) return null // Not losing weight
    if (!isWeightLoss && dailyRate <= 0) return null // Not gaining weight

    // Distance to cover
    const diff = goalWeight - currentWeight

    // Days needed = diff / rate
    const daysNeeded = diff / dailyRate

    const predictedDate = new Date()
    predictedDate.setDate(predictedDate.getDate() + daysNeeded)

    return predictedDate
}
