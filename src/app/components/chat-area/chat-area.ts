import { Component, inject, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Sparkles, Music, Quote, Book } from 'lucide-angular';
import { MarsaStore } from '../../store/marsa.store';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './chat-area.html',
  styleUrl: './chat-area.css',
})
export class ChatArea {
  readonly store = inject(MarsaStore);

  // استقبال اللغة الحالية من المكون الأب (AppComponent)
  // هذا هو المفتاح لتغيير النصوص فورياً من الـ Navbar
  lang = input.required<'ar' | 'en'>();

  readonly sparklesIcon = Sparkles;
  readonly musicIcon = Music;
  readonly quoteIcon = Quote;
  readonly bookIcon = Book;
  /**
   * دالة اكتشاف اللغة تم تحسينها:
   * تعتمد أولاً على لغة التطبيق المختارة (Input)،
   * وإذا بدأ المستخدم في الكتابة بلغة مختلفة، يمكننا ترك الـ CSS يتعامل مع الاتجاه.
   */
  isArabic = computed(() => {
    // إذا أردت أن تتبع النصوص لغة الـ Navbar دائماً:
    return this.lang() === 'ar';
  });

  generate(type: 'quote' | 'lyric' | 'quran') {
    // أضفنا quran هنا
    if (this.store.userInput().trim().length >= 3 && !this.store.isLoading()) {
      this.store.generateVibe(type);
    }
  }
}
