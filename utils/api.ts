import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

// Models confirmed working for this API key (2.5-flash is blocked for new users)
const MODEL_CANDIDATES = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
];

const STABILITY_API_KEY = process.env.EXPO_PUBLIC_STABILITY_API_KEY ?? '';
const STABILITY_API_URL =
  'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRetryable(error: unknown) {
  const message = errorMessage(error);
  return (
    message.includes('429') ||
    message.includes('503') ||
    message.includes('RATE_LIMIT') ||
    message.includes('Quota') ||
    message.includes('high demand') ||
    message.includes('unavailable') ||
    message.includes('RESOURCE_EXHAUSTED')
  );
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithFallback(message: string) {
  let lastError: unknown;

  for (const modelName of MODEL_CANDIDATES) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(message);
        return result.response.text();
      } catch (error) {
        lastError = error;
        console.warn(
          `Gemini ${modelName} attempt ${attempt + 1} failed:`,
          errorMessage(error).slice(0, 160)
        );

        if (isRetryable(error) && attempt < 2) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        break;
      }
    }
  }

  if (isRetryable(lastError)) {
    throw new Error(
      'Gemini is busy or rate-limited right now. Please wait a few seconds and try again.'
    );
  }

  throw new Error(
    lastError instanceof Error
      ? lastError.message
      : 'Failed to get a response from Gemini'
  );
}

export async function* streamMessage(message: string) {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error('API key is not configured');
  }

  const text = await generateWithFallback(message);
  const words = text.split(' ');
  for (const word of words) {
    yield word + ' ';
    await sleep(20);
  }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    if (!STABILITY_API_KEY) {
      throw new Error('Stability API key is not configured');
    }

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
    const base64Image = result.artifacts[0].base64;
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}
