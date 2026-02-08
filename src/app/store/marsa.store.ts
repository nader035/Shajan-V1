import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AiService } from '../core/services/ai.service';

type MarsaState = {
  userInput: string;
  generatedContent: string;
  author: string;
  vibe: 'quote' | 'lyric' | 'quran' | 'none';
  isLoading: boolean;
};

const initialState: MarsaState = {
  userInput: '',
  generatedContent: '',
  author: 'مَرسى',
  vibe: 'none',
  isLoading: false,
};

export const MarsaStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const aiService = inject(AiService);

    const animateText = (text: string) => {
      let current = '';
      const words = text.split(' ');
      let i = 0;

      patchState(store, { generatedContent: '' });

      const interval = setInterval(() => {
        if (i < words.length) {
          current += words[i] + ' ';
          patchState(store, { generatedContent: current });
          i++;
        } else {
          clearInterval(interval);
        }
      }, 80);
    };

    return {
      updateInput(userInput: string) {
        patchState(store, { userInput });
      },

      async generateVibe(type: 'quote' | 'lyric' | 'quran') {
        // نأخذ القيمة الحالية للمدخلات فوراً لتجنب أي تلاعب أثناء الطلب
        const currentInput = store.userInput();

        if (currentInput.trim().length < 3) return;

        try {
          patchState(store, {
            isLoading: true,
            generatedContent: '',
            author: 'مَرسى',
            vibe: type,
          });

          // التعديل الجوهري: نمرر currentInput و type بشكل صريح جداً
          const result = await aiService.generateMarsaEcho(currentInput, type);

          patchState(store, {
            author: result.author || 'مَرسى',
            isLoading: false,
          });

          if (result.content) {
            animateText(result.content);
          }
        } catch (error) {
          patchState(store, {
            isLoading: false,
            generatedContent: 'انقطع صدى الروح.. حاول مجدداً.',
            author: 'خطأ',
          });
        }
      },
    };
  }),
);
