import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { setTheme, getTheme } from '../utils/themes';

function Toggle() {
    const [isDark, setIsDark] = useState(false);

    const handleToggle = () => {
        if (getTheme() === 'theme-dark') {
            setTheme('theme-light');
            setIsDark(false);
        } else {
            setTheme('theme-dark');
            setIsDark(true);
        }
    };

    useEffect(() => {
        setIsDark(getTheme() === 'theme-dark');
    }, []);

    return (
        <button
            onClick={handleToggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: isDark ? '#1e293b' : '#695ED9',
                border: `2px solid ${isDark ? '#475569' : '#695ED9'}`,
            }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-white" />
            ) : (
                <Sun className="w-5 h-5 text-white" />
            )}
        </button>
    );
}

export default Toggle;
