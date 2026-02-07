import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AiService } from '../core/services/ai.service';

type ShajanState = {
  userInput: string;
  generatedContent: string;
  author: string;
  vibe: 'quote' | 'lyric' | 'none';
  isLoading: boolean;
};

const initialState: ShajanState = {
  userInput: '',
  generatedContent: '',
  author: 'Shajan AI',
  vibe: 'none',
  isLoading: false,
};

export const ShajanStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const aiService = inject(AiService);

    // دالة الأنيميشن بقت داخل الـ Store عشان تقدر تعدل الـ State براحتها
    const animateText = (text: string) => {
      let current = '';
      const words = text.split(' ');
      let i = 0;
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

      async generateVibe(type: 'quote' | 'lyric') {
        try {
          patchState(store, { isLoading: true, generatedContent: '', vibe: type });

          const response = await aiService.generateShajanEcho(store.userInput(), type);

          patchState(store, { isLoading: false });
          animateText(response);
        } catch (error) {
          patchState(store, {
            isLoading: false,
            generatedContent: 'The echo is lost... try again.',
          });
        }
      },
    };
  }),
);
