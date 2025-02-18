// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// export async function sendMessage(message: string) {
//   try {
//     if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
//       throw new Error('API key is not configured');
//     }

//     const response = await fetch(
//       `${GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: message
//             }]
//           }]
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);
//       const errorMessage = errorData?.error?.message || `API Error: ${response.status}`;
//       throw new Error(errorMessage);
//     }

//     const data = await response.json();
//     if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
//       throw new Error('Invalid response format from API');
//     }

//     return data.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.error('Error sending message:', error);
//     if (error instanceof Error) {
//       throw new Error(`Failed to send message: ${error.message}`);
//     }
//     throw new Error('An unexpected error occurred');
//   }
// }

///////////////////////////////

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function* streamMessage(message: string) {
  try {
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      throw new Error('API key is not configured');
    }

    const result = await model.generateContentStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Error streaming message:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to stream message: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}
