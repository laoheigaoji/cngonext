import OpenAI from 'openai';

const deepseekKey = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY : null) || 'sk-59621d871ea2481ebb5cef488b8137be';

export const deepseek = new OpenAI({
  apiKey: deepseekKey,
  baseURL: 'https://api.deepseek.com',
  dangerouslyAllowBrowser: true
});

export async function generateCityData(prompt: string) {
  return askDeepSeek(prompt, true);
}

export async function askDeepSeek(prompt: string, isJson: boolean = false) {
  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: isJson ? 'You are a professional travel curator. Responsive only with valid JSON.' : 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      response_format: isJson ? { type: 'json_object' } : undefined
    });

    if (!response.choices || response.choices.length === 0) {
      return isJson ? '{}' : '';
    }
    return response.choices[0].message.content || (isJson ? '{}' : '');
  } catch (error) {
    console.error('DeepSeek generation failed:', error);
    throw error;
  }
}
