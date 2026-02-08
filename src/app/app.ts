import { Component, signal, effect } from '@angular/core';
import { CardPreview } from './components/card-preview/card-preview';
import { NavbarComponent } from './components/shared/navbar/navbar';
import { ChatArea } from './components/chat-area/chat-area';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatArea, CardPreview, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = signal('Marsa');
  isDarkMode = signal(true);
  currentLang = signal<'ar' | 'en'>('ar');
  constructor() {
    // استخدام effect لمراقبة التغييرات وتطبيقها على الـ DOM
    effect(() => {
      // الـ Theme
      document.body.classList.toggle('light-theme', !this.isDarkMode());

      // اللغة والاتجاه
      const lang = this.currentLang();
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    });
  }

  // هذه الدوال سيتم استدعاؤها من الـ Navbar
  onThemeToggle() {
    this.isDarkMode.update((v) => !v);
  }

  onLanguageToggle() {
    this.currentLang.update((l) => (l === 'ar' ? 'en' : 'ar'));
  }
}
