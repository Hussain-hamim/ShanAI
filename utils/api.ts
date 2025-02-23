import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const STABILITY_API_KEY = 'sk-XDt3fSaIrMVKOg3C5vXUdAC73CANpoRkpvB42f5snPChkKfH';
const STABILITY_API_URL =
  'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

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

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const result = await response.json();

    // Stability AI returns base64 images, we need to convert it to a data URL
    const base64Image = result.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}
