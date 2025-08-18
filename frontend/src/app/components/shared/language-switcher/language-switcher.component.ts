import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  availableLanguages: { code: string; name: string; flag: string }[] = [];
  private subscription = new Subscription();

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    
    this.subscription.add(
      this.translationService.currentLanguage$.subscribe(lang => {
        this.currentLanguage = lang;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLanguageChange(languageCode: string): void {
    this.translationService.setLanguage(languageCode);
  }

  getCurrentLanguageDisplay(): { code: string; name: string; flag: string } {
    return this.availableLanguages.find(lang => lang.code === this.currentLanguage) || this.availableLanguages[0];
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
} 