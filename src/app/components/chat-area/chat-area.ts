import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Sparkles, Music, Quote } from 'lucide-angular';
import { ShajanStore } from '../../store/shajan.store';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './chat-area.html',
  styleUrl: './chat-area.css',
})
export class ChatArea {
  // حقن الـ Store باستخدام نظام الـ Signals الجديد في Angular 21
  readonly store = inject(ShajanStore);

  // تعريف أيقونات Lucide المستخدمة في الـ Template
  readonly sparklesIcon = Sparkles;
  readonly musicIcon = Music;
  readonly quoteIcon = Quote;

  /**
   * Signal محسوبة تكتشف لغة المستخدم فورياً أثناء الكتابة.
   * تستخدم لتغيير الـ Placeholders ونصوص الأزرار في الـ HTML تلقائياً.
   */
  isArabic = computed(() => {
    const input = this.store.userInput();
    // فحص لو النص يحتوي على حروف من النطاق العربي
    return /[\u0600-\u06FF]/.test(input);
  });

  /**
   * دالة بدء توليد الصدى (Echo).
   * @param type نوع المحتوى المطلوب (Lyric أو Quote)
   */
  generate(type: 'quote' | 'lyric') {
    const inputLength = this.store.userInput().trim().length;

    // تأكد من وجود مدخلات كافية (على الأقل 3 أحرف) قبل مناداة الـ API
    if (inputLength >= 3 && !this.store.isLoading()) {
      this.store.generateVibe(type);
    }
  }
}
