"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import es from '@/locales/es.json';
import de from '@/locales/de.json';
import pt from '@/locales/pt.json';
import zh from '@/locales/zh.json';

type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'zh';

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Mandarin' },
] as const;

const translations: Record<LanguageCode, any> = { en, fr, es, de, pt, zh };

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (language: LanguageCode) => void;
    t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<LanguageCode>('en');

    const t = useCallback((key: string, options?: Record<string, string | number>) => {
        const langFile = translations[language];
        let translation = key.split('.').reduce((obj, key) => obj?.[key], langFile);
        
        if (typeof translation !== 'string') {
            console.warn(`Translation for key "${key}" not found in language "${language}".`);
            return key;
        }

        if (options) {
            Object.keys(options).forEach(optKey => {
                translation = translation.replace(`{{${optKey}}}`, String(options[optKey]));
            });
        }

        return translation;
    }, [language]);

    useEffect(() => {
        const storedLang = localStorage.getItem('language') as LanguageCode;
        if (storedLang && languages.some(l => l.code === storedLang)) {
            setLanguage(storedLang);
        }
    }, []);

    const handleSetLanguage = (lang: LanguageCode) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Alias for easier usage in components
export const useTranslation = useLanguage;
