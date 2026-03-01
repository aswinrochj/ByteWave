"use client"

import * as React from "react"
import { LucideSun, LucideMoon, LucideSparkles } from "lucide-react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 bg-card/50 backdrop-blur-md text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 rounded-xl shadow-sm">
                    <LucideSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 midnight:-rotate-90 midnight:scale-0" />
                    <LucideMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 midnight:rotate-90 midnight:scale-0" />
                    <LucideSparkles className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all midnight:rotate-0 midnight:scale-100 dark:rotate-90 dark:scale-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-xl border-border/50 text-foreground p-1.5 rounded-2xl shadow-2xl min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-xl px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all">
                    <LucideSun className="w-4 h-4 mr-2" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-xl px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all">
                    <LucideMoon className="w-4 h-4 mr-2" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("midnight")} className="rounded-xl px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-all font-bold">
                    <LucideSparkles className="w-4 h-4 mr-2 text-primary" /> Midnight Gold
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
