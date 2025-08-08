import en from './en.json';
import de from './de.json';

export type Language = 'en' | 'de';

export const languages = {
  en: 'English',
  de: 'Deutsch'
};

export const translations = {
  en,
  de
};

export const defaultLanguage: Language = 'en';

export function getTranslation(lang: Language = defaultLanguage) {
  return translations[lang] || translations[defaultLanguage];
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language') as Language;
    if (stored && stored in translations) {
      return stored;
    }
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang in translations) {
      return browserLang;
    }
  }
  
  return defaultLanguage;
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  }
}

export function t(key: string, lang?: Language): string {
  const translation = getTranslation(lang || getCurrentLanguage());
  
  return key.split('.').reduce((obj: any, k: string) => {
    return obj && obj[k] !== undefined ? obj[k] : key;
  }, translation);
}
