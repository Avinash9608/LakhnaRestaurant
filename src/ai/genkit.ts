import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY || 'AIzaSyB-o9J7ANjRvwHmMCavpNZlSBM2OXAkiqE',
  })],
  model: 'googleai/gemini-2.0-flash',
});
