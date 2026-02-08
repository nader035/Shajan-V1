import { Component, inject, computed, input } from '@angular/core';
import { LucideAngularModule, Quote, Music, Share2, Download, Sparkles } from 'lucide-angular';
import { MarsaStore } from '../../store/marsa.store';
import { ShareService } from '../../core/services/share.service';

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './card-preview.html',
})
export class CardPreview {
  readonly store = inject(MarsaStore);
  private shareService = inject(ShareService);

  // تأكد أن الأسماء هنا تطابق [lang] و [isDarkMode] في app.html
  lang = input.required<'ar' | 'en'>();
  isDarkMode = input.required<boolean>();

  readonly shareIcon = Share2;
  readonly downloadIcon = Download;

  // دالة حجم الخط
  dynamicFontSize = computed(() => {
    const content = this.store.generatedContent() || '';
    const isAr = this.lang() === 'ar'; // نعتمد على الـ input مباشرة
    if (content.length > 100) return isAr ? 'text-xl' : 'text-lg';
    if (content.length > 50) return isAr ? 'text-2xl' : 'text-xl';
    return isAr ? 'text-4xl' : 'text-3xl';
  });

  async onShare() {
    await this.shareService.shareCard('Marsa-card');
  }

  async onDownload() {
    if (!this.store.generatedContent()) return;
    await this.shareService.shareCard('Marsa-card');
  }
}
