import { Component, inject, computed } from '@angular/core';
import { LucideAngularModule, Quote, Music, Share2, Download } from 'lucide-angular';
import { ShajanStore } from '../../store/shajan.store';
import { ShareService } from '../../core/services/share.service';

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css',
})
export class CardPreview {
  // حقن الـ Store والـ Service باستخدام inject (أسلوب Angular 21)
  readonly store = inject(ShajanStore);
  private shareService = inject(ShareService);

  // تعريف الأيقونات لاستخدامها في الـ Template
  readonly quoteIcon = Quote;
  readonly musicIcon = Music;
  readonly shareIcon = Share2;
  readonly downloadIcon = Download;

  /**
   * Signal محسوبة لتحديد حجم الخط بناءً على طول النص واللغة.
   * تعطي حجماً أكبر للنصوص العربية لأن خط Tajawal يظهر أصغر نسبياً من اللاتيني.
   */
  dynamicFontSize = computed(() => {
    const content = this.store.generatedContent() || '';
    const isArabic = /[\u0600-\u06FF]/.test(content);

    if (content.length > 80) return isArabic ? 'text-2xl' : 'text-xl';
    if (content.length > 40) return isArabic ? 'text-3xl' : 'text-2xl';

    // الوضع الافتراضي للنصوص القصيرة
    return isArabic ? 'text-4xl' : 'text-3xl';
  });

  /**
   * دالة لمشاركة الكارت عبر الـ Native Share الخاص بالموبايل/المتصفح.
   */
  async onShare() {
    const cardElementId = 'shajan-card'; 
    await this.shareService.shareCard(cardElementId);
  }

  /**
   * دالة لتحميل الكارت كصورة PNG مباشرة للجهاز.
   */
  async onDownload() {
    if (!this.store.generatedContent()) return;

    // يمكننا استخدام نفس دالة الـ shareCard لأنها تحتوي على fallback للتحميل،
    // أو نطلب من الـ service تنفيذ تحميل مباشر فقط.
    await this.shareService.shareCard('shajan-card');
  }

  /**
   * دالة مساعدة للتحقق من اللغة في الـ HTML (اختياري للتحكم في الترجمة)
   */
  isArabic = computed(() => {
    return /[\u0600-\u06FF]/.test(this.store.generatedContent());
  });
}
