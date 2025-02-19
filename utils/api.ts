import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function* streamMessage(message: string) {
  try {
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      throw new Error('API key is not configured');
    }

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Simulate streaming by chunking the text
    const words = text.split(' ');
    for (const word of words) {
      yield word + ' ';
      // Add a small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 40));
      // await new Promise((resolve) => resolve);
    }
  } catch (error) {
    console.error('Error streaming message:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to stream message: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}
