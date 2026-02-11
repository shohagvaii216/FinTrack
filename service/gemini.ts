
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanReceipt = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Extract transaction details from this receipt into JSON: amount (number), date (YYYY-MM-DD), category (select from: Food, Travel, Shopping, Bills, Salary, Others), note (vendor name)." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            note: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};

export const generateFinancialForecast = async (transactions: any[]) => {
  try {
    const simplifiedData = transactions.map(t => ({
      amount: t.amount,
      category: t.category,
      date: t.date,
      type: t.type
    })).slice(0, 50);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these transactions: ${JSON.stringify(simplifiedData)}, predict the next month's spending. 
      Analyze trends for categories like Food, Travel, Utility Bills. 
      Return JSON with nextMonthTotal (number), confidenceScore (0-100), insights (Bengali string), and categoryBreakdown (array of {category, predictedAmount, reason (Bengali), trend: 'Up'|'Down'|'Stable'}).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextMonthTotal: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER },
            insights: { type: Type.STRING },
            categoryBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  predictedAmount: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  trend: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Forecasting Error:", error);
    return null;
  }
};

export const askFinancialAdvisor = async (query: string, history: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are FinTrack, a premium financial advisor. User asked: "${query}". 
      Context: ${JSON.stringify(history)}. 
      Provide helpful, brief financial advice in Bengali. Focus on savings, investments, and budgeting.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Advisor Error:", error);
    return "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। আপনার ইন্টারনেট কানেকশন চেক করুন।";
  }
};

export const processVoiceCommand = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse this Bengali financial command into JSON: "${text}". 
      Expected JSON format: { amount: number, category: string, note: string, type: 'Income' | 'Expense' }.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            note: { type: Type.STRING },
            type: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Voice Process Error:", error);
    return null;
  }
};

export const parseFinancialSms = async (smsText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract transaction details from this SMS text: "${smsText}". 
      Return JSON: { amount: number, type: 'Income'|'Expense', provider: string, note: string, date: 'YYYY-MM-DD' }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING },
            provider: { type: Type.STRING },
            note: { type: Type.STRING },
            date: { type: Type.STRING }
          },
          required: ["amount", "type", "provider"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("SMS Parsing Error:", error);
    return null;
  }
};
