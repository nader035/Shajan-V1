import { Component, input, output, signal } from '@angular/core';
import { LucideAngularModule, Moon, Sun, Languages, Github } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  // استقبال البيانات بالأسماء الجديدة التي استخدمتها في app.html
  isDark = input.required<boolean>(); 
  lang = input.required<'ar' | 'en'>();

  // إرسال الأحداث بالأسماء الجديدة
  toggleTheme = output<void>();
  toggleLang = output<void>();

  // أيقونات Lucide
  readonly moonIcon = Moon;
  readonly sunIcon = Sun;
  readonly langIcon = Languages;
  readonly githubIcon = Github;

}