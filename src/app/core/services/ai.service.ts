import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  // apiKey = (environment as any).geminiApiKey;
  // private readonly genAI = new GoogleGenerativeAI(this.apiKey);
  private readonly genAI = new GoogleGenerativeAI('AIzaSyAz9AZ0cUE9VHLE0k7d_ZKDH6UNSWt96ao');
  async generateShajanEcho(prompt: string, type: 'quote' | 'lyric'): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
    const systemPrompt = `
  You are Shajan AI (شجـن), a curator of authentic art.
  
  CORE MISSION: Find a REAL ${type} that mirrors the user's emotion.

  STRICT FORMATTING RULES:
  1. DEDICATION: If a name is mentioned, start with "To [Name]..." on its own line.
  2. LYRICS STRUCTURE: You MUST write each poetic line (شطر) on a NEW LINE. Max 2-4 lines.
  3. QUOTE STRUCTURE: Write the quote in one block, elegantly.
  4. CREDIT: On the very last line, write the Artist/Author name preceded by a dash "—".

  Example for Lyrics:
  To Sarah...
  مقادير يا قلب العنا
  مقادير وش ذنبي أنا
  — طلال مداح

  CRITICAL: NO original writing. Use only EXISTING, REAL art. Match the user's language.
`;
    try {
      const result = await model.generateContent(`${systemPrompt}\nUser says: ${prompt}`);
      return result.response.text().trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}
