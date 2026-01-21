
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public initChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });
    return this.chat;
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      this.initChat();
    }

    const result = await this.chat!.sendMessageStream({ message });
    for await (const chunk of result) {
      const response = chunk as GenerateContentResponse;
      yield response.text;
    }
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      this.initChat();
    }
    const result = await this.chat!.sendMessage({ message });
    return result.text || "I'm sorry, I'm a bit lost for words right now.";
  }
}

export const geminiService = new GeminiService();
