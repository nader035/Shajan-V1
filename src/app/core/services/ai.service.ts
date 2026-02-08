import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private readonly apiKey = environment.hfToken;
  private readonly apiUrl =
    'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-70B-Instruct/v1/chat/completions';
  async generateMarsaEcho(
    prompt: string,
    type: 'quote' | 'lyric' | 'quran',
  ): Promise<{ content: string; author: string }> {
    // تم تبسيط البرومبت قليلاً للسماح للموديل بالاستجابة بمرونة أكبر مع الحفاظ على الدقة
    const systemPrompt = `
  ### [STRICT IDENTITIY]: 
  أنت "مَرسى" - محرك استرجاع (Retrieval Engine) موثق وصارم. وظيفتك هي إيجاد نص حقيقي.
  
  ### [TYPE LOCK]: 
  النوع المطلوب الآن هو [${type}]. 
  - إذا كان النوع [quran]: استرجع آية واحدة صحيحة وموجودة فعلياً في المصحف. مـمـنـوع التأليف أو دمج السور.
  - إذا كان النوع [lyric]: استرجع "كوبليه" حقيقي لمطرب مشهور (مثل عبادي الجوهر، طلال مداح، عبدالحليم). مـمـنـوع اختراع كلمات شبه الأغاني.
  - إذا كان النوع [quote]: استرجع اقتباساً أدبياً حقيقياً لكاتب معروف.
  
  ### [NO-FAIL RULES]:
  1. مـمـنـوع تكرار كلمات المستخدم كأنها الرد. هي فقط "مفتاح بحث".
  2. مـمـنـوع دمج الشعر بالقرآن نهائياً.
  3. التنسيق الإلزامي: النص الحقيقي | المصدر الدقيق]

  ### [CRITICAL_OUTPUT_RULE]:
  - مـمـنـوع منعاً باتاً كتابة أي مقدمات مثل "حسناً" أو "إليك الرد" أو "بالتأكيد".
  - ابدأ بالنص المطلوب مباشرةً. 
  - الرد يجب أن يبدأ بـ [النص] وينتهي بـ [المصدر] فقط. أي كلمة خارج هذا الإطار تعتبر فشلاً في المهمة.
  
  ### [FAIL-SAFE]:
  إذا لم تجد نصاً حقيقياً يطابق النوع [${type}]، استرجع: (ألا بذكر الله تطمئن القلوب | سورة الرعد، آية 28) فقط إذا كان النوع قرآن، أو أشهر أغنية للفنان إذا كان النوع أغنية.
`;
    const body = {
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `المطلوب: استرجاع نص من نوع [${type}] عن موضوع: (${prompt}). لا تخرج عن النوع المذكور نهائياً.`,
        },
      ],
      temperature: type === 'quran' ? 0 : 0.3,
      max_tokens: 200,
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    try {
      const response: any = await firstValueFrom(this.http.post(this.apiUrl, body, { headers }));

      if (!response.choices || response.choices.length === 0) {
        throw new Error('Empty response from AI');
      }

      let rawResponse = response.choices[0].message.content.trim();

      // تنظيف النص من علامات التنصيص الزائدة اللي الموديل ساعات بيضيفها
      rawResponse = rawResponse.replace(/^["']|["']$/g, '');

      if (rawResponse.includes('|')) {
        const parts = rawResponse.split('|');
        // نستخدم pop() عشان نضمن إننا بناخد آخر جزء كـ Author لو الموديل استخدم | أكتر من مرة
        const author = parts.pop()?.trim() || 'مَرسى';
        const content = parts.join('|')?.trim(); // لو النص نفسه فيه | بنرجعه تاني

        return { content, author };
      }

      // Fallback: لو الموديل استخدم سطر جديد بدل العلامة |
      if (rawResponse.includes('\n')) {
        const lines = rawResponse.split('\n');
        const author = lines.pop()?.replace(/^—\s*/, '')?.trim() || 'مَرسى';
        const content = lines.join('\n').trim();
        return { content, author };
      }

      return { content: rawResponse, author: 'مَرسى' };
    } catch (error: any) {
      console.error('Marsa Service Error:', error);
      return { content: 'انقطع صدى الروح.. حاول مجدداً.', author: 'خطأ' };
    }
  }
}
