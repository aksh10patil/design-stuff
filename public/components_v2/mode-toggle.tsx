'use client'

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';


export const ModeToggle = () => {

    const { resolvedTheme, setTheme } = useTheme();

    return <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        className='absolute flex items-center justify-center top-4 right-4'>
        <SunIcon className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
        <MoonIcon className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />

    </button>
}
