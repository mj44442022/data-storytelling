import { ElevenLabsClient } from "elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function generateVoice(
  text: string,
  voiceId: string = 'default'
): Promise<Buffer> {
  try {
    const audio = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_multilingual_v2"
    });

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Voice generation error:', error);
    throw new Error('Failed to generate voice');
  }
}

export async function cloneVoice(
  audioFiles: File[],
  name: string,
  description: string
): Promise<string> {
  try {
    // This would use ElevenLabs voice cloning API
    // For MVP, we'll use a default voice
    return 'default_voice_id';
  } catch (error) {
    console.error('Voice cloning error:', error);
    throw new Error('Failed to clone voice');
  }
}

export default elevenlabs;
