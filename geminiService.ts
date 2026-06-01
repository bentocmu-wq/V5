import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_TEMPLATE } from "./constants";
import { Message, Sender } from "./types";

let geminiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!geminiClient) {
    // Vite will statically replace process.env.GEMINI_API_KEY at build time
    let apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback for Vite env vars if needed
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      apiKey = import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.VITE_API_KEY || "";
    }

    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      console.error("API_KEY is missing.");
      throw new Error("MISSING_API_KEY");
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
};

export const generateResponse = async (
  userMessage: string,
  history: Message[],
  dataContext: string
): Promise<string> => {
  const maxRetries = 2;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const client = getClient();
      
      const systemInstruction = SYSTEM_PROMPT_TEMPLATE.replace('{{DATA_CONTEXT}}', dataContext);

      const recentHistory = history.slice(-6).map(msg => ({
        role: msg.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const model = 'gemini-3.5-flash';

      const chat = client.chats.create({
        model: model,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3,
        },
        history: recentHistory
      });

      const result = await chat.sendMessage({
          message: userMessage
      });

      return result.text || "ขออภัยค่ะ ระบบขัดข้องชั่วคราว (No Response)";

    } catch (error: any) {
      lastError = error;
      const errStr = error.toString();
      
      // If it's a rate limit (429) or server error (500), try again after a short delay
      if ((errStr.includes("429") || errStr.includes("500") || errStr.includes("503")) && attempt < maxRetries) {
        console.warn(`Retry attempt ${attempt + 1} due to error:`, errStr);
        await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1))); // Exponential-ish backoff
        continue;
      }
      
      // For other errors (like 400, 403), don't retry
      break; 
    }
  }

  // If we reach here, it failed after retries
  const error = lastError;
  console.error("Gemini API Error Detail:", error);
  
  const errStr = error.toString();
  const errMsg = error.message || "";

  // Specific Error Handling for User Feedback
  if (errMsg === "MISSING_API_KEY") {
      return "⚠️ ขออภัยค่ะ ระบบยังไม่พบ API Key\n(หากใช้งานบน Cloud Run ระบบจะจัดการให้อัตโนมัติ แต่หากรันที่อื่นโปรดตรวจสอบ Environment Variables)";
  }

  if (errStr.includes("400") || errStr.includes("INVALID_ARGUMENT")) {
      return "❌ API Key ไม่ถูกต้อง (Error 400)\n(กรุณาตรวจสอบว่า Copy รหัสมาครบไหม มีเว้นวรรคเกินมาหรือไม่)";
  }

  if (errStr.includes("403") || errStr.includes("PERMISSION_DENIED")) {
      return "🚫 สิทธิ์การเข้าถึงถูกปฏิเสธ (Error 403)\n(อาจเกิดจาก Key ผิดประเภท หรือยังไม่ได้เปิดใช้บริการใน Google Cloud)";
  }
  
  if (errStr.includes("429")) {
      return "⏳ ขออภัยค่ะ ช่วงนี้มีผู้ใช้งานห้องแชทเยอะมาก (Rate Limit)\n(พี่แก้วรบกวนรอสัก 1-2 นาทีแล้วค่อยพิมพ์ใหม่นะคะ หรือลองถามสั้นลงนิดนึงค่ะ)";
  }

  return `⚠️ เกิดข้อผิดพลาดทางเทคนิค:\n"${errMsg || errStr}"\n(โปรดแจ้งปัญหานี้ให้ผู้ดูแลระบบทราบ)`;
};