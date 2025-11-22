import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function transcribeAudio(audioFile: File | Blob): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile as any,
      model: 'whisper-1',
      response_format: 'json',
      language: 'auto',
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function translateWithCulturalAdaptation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{ translation: string; adaptations: any[] }> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a cultural adaptation specialist. Translate this content from ${sourceLanguage} to ${targetLanguage}, adapting idioms, humor, and cultural references. Don't just translate words—adapt meaning and cultural context.

Return a JSON object with:
1. "translation": the culturally adapted text
2. "adaptations": array of objects with {original, adapted, reason, position}

Example:
{
  "translation": "...",
  "adaptations": [
    {
      "original": "piece of cake",
      "adapted": "pan comido",
      "reason": "Cultural equivalent of an easy task",
      "position": 150
    }
  ]
}`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate content');
  }
}

export default openai;
