'use client'

import Link from 'next/link'
import { UserCircle, LayoutDashboard, Target, BarChart2 } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import MeasurementForm from './MeasurementForm'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

export default function Navbar({ userId }: { userId?: string }) {
    const pathname = usePathname()
    if (!userId) return null

    const isActive = (path: string) => pathname === path

    return (
        <>
            {/* Desktop Navbar (Top) */}
            <nav className="hidden md:block fixed top-0 w-full z-40 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                                HealthTracker
                            </Link>
                            <div className="flex gap-4">
                                <Link
                                    href="/"
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isActive('/') ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/stats"
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isActive('/stats') ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Progreso
                                </Link>
                                <Link
                                    href="/goals"
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isActive('/goals') ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Objetivos
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link
                                href="/profile"
                                className={cn(
                                    "p-2 transition-colors rounded-full hover:bg-muted",
                                    isActive('/profile') ? "text-foreground bg-muted" : "text-muted-foreground"
                                )}
                            >
                                <UserCircle className="w-5 h-5" />
                            </Link>
                            <MeasurementForm userId={userId} mode="navbar" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-12 left-0 right-0 z-40 mx-4 mb-4 rounded-3xl border border-white/20 bg-background/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 pb-0">
                <div className="grid grid-cols-5 h-16 items-center px-1">
                    <Link
                        href="/"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 py-1 transition-all rounded-xl mx-1",
                            isActive('/') ? "text-foreground bg-black/5 dark:bg-white/10" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Inicio</span>
                    </Link>

                    <Link
                        href="/stats"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 py-1 transition-all rounded-xl mx-1",
                            isActive('/stats') ? "text-foreground bg-black/5 dark:bg-white/10" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <BarChart2 className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Prog.</span>
                    </Link>

                    <div className="flex flex-col items-center justify-center -mt-8">
                        <div className="rounded-full bg-background p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                            <MeasurementForm userId={userId} mode="navbar" />
                        </div>
                    </div>

                    <Link
                        href="/goals"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 py-1 transition-all rounded-xl mx-1",
                            isActive('/goals') ? "text-foreground bg-black/5 dark:bg-white/10" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Target className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Metas</span>
                    </Link>

                    <Link
                        href="/profile"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 py-1 transition-all rounded-xl mx-1",
                            isActive('/profile') ? "text-foreground bg-black/5 dark:bg-white/10" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <UserCircle className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </div>
            </nav>

            {/* Spacer for top navbar on desktop */}
            <div className="hidden md:block h-16" />
        </>
    )
}
