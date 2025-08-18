import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Translation {
  [key: string]: string | Translation;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: Translation } = {};

  constructor() {
    this.loadTranslations();
    this.loadLanguageFromStorage();
  }

  private loadTranslations(): void {
    // English translations
    this.translations['en'] = {
      nav: {
        home: 'Home',
        about: 'About',
        races: 'Races',
        raceInfo: 'Race Info',
        newsMedia: 'News & Media',
        sponsors: 'Sponsors',
        contact: 'Contact',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        logout: 'Logout',
        language: 'Language'
      },
      raceInfo: {
        overview: 'Overview',
        kitCollection: 'Kit Collection',
        routeMap: 'Route Map',
        prizeMoney: 'Prize Money',
        raceResults: 'Race Results'
      },
      newsMedia: {
        latestNews: 'Latest News',
        pressReleases: 'Press Releases',
        mediaGallery: 'Media Gallery',
        interviews: 'Interviews',
        eventCoverage: 'Event Coverage'
      },
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        confirm: 'Confirm',
        close: 'Close'
      }
    };

    // Swahili translations
    this.translations['sw'] = {
      nav: {
        home: 'Nyumbani',
        about: 'Kuhusu',
        races: 'Mbio',
        raceInfo: 'Habari za Mbio',
        newsMedia: 'Habari na Vyombo',
        sponsors: 'Wadhamini',
        contact: 'Wasiliana',
        login: 'Ingia',
        register: 'Jisajili',
        dashboard: 'Dashibodi',
        logout: 'Toka',
        language: 'Lugha'
      },
      raceInfo: {
        overview: 'Muhtasari',
        kitCollection: 'Ukusanyaji wa Kit',
        routeMap: 'Ramani ya Njia',
        prizeMoney: 'Pesa za Tuzo',
        raceResults: 'Matokeo ya Mbio'
      },
      newsMedia: {
        latestNews: 'Habari za Hivi Karibuni',
        pressReleases: 'Habari za Vyombo',
        mediaGallery: 'Ukumbi wa Picha',
        interviews: 'Mahojiano',
        eventCoverage: 'Ufuatiliaji wa Hafla'
      },
      common: {
        welcome: 'Karibu',
        loading: 'Inapakia...',
        error: 'Hitilafu',
        success: 'Mafanikio',
        cancel: 'Ghairi',
        save: 'Hifadhi',
        edit: 'Hariri',
        delete: 'Futa',
        confirm: 'Thibitisha',
        close: 'Funga'
      }
    };
  }

  private loadLanguageFromStorage(): void {
    const savedLanguage = localStorage.getItem('nyerere-marathon-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sw')) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public setLanguage(languageCode: string): void {
    if (languageCode === 'en' || languageCode === 'sw') {
      this.currentLanguageSubject.next(languageCode);
      localStorage.setItem('nyerere-marathon-language', languageCode);
    }
  }

  public getTranslation(key: string): string {
    const currentLang = this.getCurrentLanguage();
    const keys = key.split('.');
    let translation: any = this.translations[currentLang];

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found
        translation = this.translations['en'];
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && fallbackKey in translation) {
            translation = translation[fallbackKey];
          } else {
            return key; // Return the key itself if not found in fallback
          }
        }
        break;
      }
    }

    return typeof translation === 'string' ? translation : key;
  }

  public getAvailableLanguages(): { code: string; name: string; flag: string }[] {
    return [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
    ];
  }
} 