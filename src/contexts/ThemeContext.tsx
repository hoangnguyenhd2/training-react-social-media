import { useState, useEffect, createContext } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextProps = {
    theme: Theme
    toggleTheme: () => void
};

export const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [ theme, setTheme ] = useState<Theme>(localStorage.getItem('theme') as Theme || 'light');

    const toggleTheme = () => {
        setTheme(currentTheme => {
            const switchTheme = ( currentTheme === 'dark' ? 'light' : 'dark' );
            localStorage.setItem('theme', switchTheme);
            return switchTheme;
        });
    }

    useEffect(() => {
        window.document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}