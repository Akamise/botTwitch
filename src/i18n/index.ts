import en from './locales/en';
import uk from './locales/uk';
import {Locale} from "./types";

const translations = {
    en,
    uk
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale): void {
    currentLocale = locale;
}

export function getLocale(): Locale {
    return currentLocale;
}

export function t(key: string): string {
    const keys = key.split('.');
    let result: any = translations[currentLocale];

    for (const k of keys) {
        if (!result[k]) return key;
        result = result[k];
    }

    return result;
}