import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
    title: 'Health Tracker',
    description: 'Registra y analiza tu peso y composición corporal',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Health Tracker',
    },
}

export const viewport: Viewport = {
    themeColor: '#09090b', // Zinc-950 for dark mode match
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground min-h-screen selection:bg-indigo-500/30 selection:text-indigo-500`}>
                <Providers>
                    <Navbar userId={user?.id} />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
