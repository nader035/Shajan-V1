import { Component, signal } from '@angular/core';
import { LucideAngularModule, Moon, Github } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  readonly moonIcon = Moon;
  readonly githubIcon = Github;
  // استخدام Signal لاسم التطبيق لسهولة التغيير لاحقاً
  brandName = signal('SHAJAN');
}
