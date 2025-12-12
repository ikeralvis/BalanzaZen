'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No estás autenticado' }
    }

    const age = formData.get('age')
    const height = formData.get('height')

    // We update both metadata (for consistency if used elsewhere) and the profile table
    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        age: Number(age),
        height: Number(height),
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function getMeasurementsForExport(range: string = 'all') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    let query = supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    if (range !== 'all') {
        let startDate = new Date()
        startDate.setHours(0, 0, 0, 0)

        switch (range) {
            case '1m': startDate.setMonth(startDate.getMonth() - 1); break;
            case '3m': startDate.setMonth(startDate.getMonth() - 3); break;
            case '6m': startDate.setMonth(startDate.getMonth() - 6); break;
            case '1y': startDate.setFullYear(startDate.getFullYear() - 1); break;
        }
        query = query.gte('date', startDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function deleteMeasurement(id: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/profile')
    revalidatePath('/')
    return { success: true }
}
