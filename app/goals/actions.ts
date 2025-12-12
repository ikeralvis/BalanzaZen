'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTargetWeight(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No estás autenticado' }
    }

    const targetWeight = formData.get('target_weight')

    const { error } = await supabase.from('profiles').update({
        target_weight: Number(targetWeight),
    }).eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    return { success: true }
}
