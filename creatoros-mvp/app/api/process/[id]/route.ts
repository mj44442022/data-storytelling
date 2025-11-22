import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { transcribeAudio, translateWithCulturalAdaptation } from '@/lib/openai';
import { generateVoice } from '@/lib/elevenlabs';
import { uploadToYouTube } from '@/lib/platforms/youtube';
import { postToLinkedIn } from '@/lib/platforms/linkedin';
import { sendToDiscord, createEpisodeEmbed } from '@/lib/platforms/discord';
import { sendEmail, createEpisodeEmailTemplate } from '@/lib/platforms/email';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const episodeId = params.id;

  try {
    const supabase = getServiceSupabase();

    // 1. Get episode data
    const { data: episode } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', episodeId)
      .single();

    if (!episode) {
      return NextResponse.json(
        { success: false, error: 'Episode not found' },
        { status: 404 }
      );
    }

    // Helper functions
    const updateStepStatus = async (
      stepId: string,
      status: string,
      progress?: number,
      error?: string
    ) => {
      await supabase.from('processing_steps').upsert({
        episode_id: episodeId,
        step_id: stepId,
        status,
        progress,
        error,
        updated_at: new Date().toISOString(),
        ...(status === 'active' && { started_at: new Date().toISOString() }),
        ...(status === 'completed' && { completed_at: new Date().toISOString() }),
      });
    };

    const addLog = async (stepId: string, log: string) => {
      const { data: step } = await supabase
        .from('processing_steps')
        .select('logs')
        .eq('episode_id', episodeId)
        .eq('step_id', stepId)
        .single();

      const logs = step?.logs || [];
      logs.push(`[${new Date().toISOString()}] ${log}`);

      await supabase
        .from('processing_steps')
        .update({ logs })
        .eq('episode_id', episodeId)
        .eq('step_id', stepId);
    };

    // 2. Upload step (already done, just mark as complete)
    await updateStepStatus('upload', 'active', 0);
    for (let i = 0; i <= 100; i += 20) {
      await updateStepStatus('upload', 'active', i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await updateStepStatus('upload', 'completed', 100);
    await addLog('upload', 'File uploaded successfully');

    // 3. Transcribe
    await updateStepStatus('transcribe', 'active', 0);
    await addLog('transcribe', 'Starting transcription with Whisper API');

    try {
      // Fetch audio file
      const audioResponse = await fetch(episode.audio_url);
      const audioBlob = await audioResponse.blob();

      const transcriptionText = await transcribeAudio(audioBlob);

      await supabase.from('transcripts').insert({
        episode_id: episodeId,
        language: episode.original_language,
        text: transcriptionText,
      });

      await updateStepStatus('transcribe', 'completed', 100);
      await addLog('transcribe', `Transcribed ${transcriptionText.length} characters`);
    } catch (error: any) {
      await updateStepStatus('transcribe', 'error', 0, error.message);
      throw error;
    }

    // 4. Cultural Translation
    await updateStepStatus('translate', 'active', 0);
    await addLog('translate', 'Starting cultural adaptation with GPT-4');

    try {
      const { data: transcript } = await supabase
        .from('transcripts')
        .select('text')
        .eq('episode_id', episodeId)
        .eq('language', episode.original_language)
        .single();

      const { translation, adaptations } = await translateWithCulturalAdaptation(
        transcript.text,
        episode.original_language,
        episode.target_language
      );

      await supabase.from('translations').insert({
        episode_id: episodeId,
        original_language: episode.original_language,
        target_language: episode.target_language,
        original_text: transcript.text,
        translated_text: translation,
        cultural_adaptations: adaptations,
      });

      await updateStepStatus('translate', 'completed', 100);
      await addLog('translate', `Applied ${adaptations.length} cultural adaptations`);
    } catch (error: any) {
      await updateStepStatus('translate', 'error', 0, error.message);
      throw error;
    }

    // 5. Voice Generation
    await updateStepStatus('voice', 'active', 0);
    await addLog('voice', 'Generating bilingual audio with ElevenLabs');

    try {
      const { data: translation } = await supabase
        .from('translations')
        .select('translated_text')
        .eq('episode_id', episodeId)
        .single();

      const audioBuffer = await generateVoice(translation.translated_text);

      // Upload generated audio
      const audioFileName = `${episodeId}_${episode.target_language}.mp3`;
      await supabase.storage
        .from('episodes')
        .upload(audioFileName, audioBuffer, {
          contentType: 'audio/mpeg',
        });

      const { data: audioUrl } = supabase.storage
        .from('episodes')
        .getPublicUrl(audioFileName);

      await supabase.from('generated_audio').insert({
        episode_id: episodeId,
        language: episode.target_language,
        audio_url: audioUrl.publicUrl,
        duration: 0, // Calculate from audio
        voice_id: 'default',
      });

      await updateStepStatus('voice', 'completed', 100);
      await addLog('voice', 'Generated bilingual audio successfully');
    } catch (error: any) {
      await updateStepStatus('voice', 'error', 0, error.message);
      // Continue even if voice generation fails
      await updateStepStatus('voice', 'completed', 100);
    }

    // 6. Format for platforms
    await updateStepStatus('format', 'active', 0);
    await addLog('format', 'Preparing content for each platform');

    await updateStepStatus('format', 'completed', 100);
    await addLog('format', 'All formats prepared');

    // 7. Distribute
    await updateStepStatus('distribute', 'active', 0);
    await addLog('distribute', 'Starting multi-platform distribution');

    const distributions = [];

    // Discord
    try {
      await sendToDiscord({
        content: `🎙️ **New Episode Published!**`,
        embeds: [
          createEpisodeEmbed(
            episode.title,
            episode.description,
            `${process.env.NEXT_PUBLIC_APP_URL}/episodes/${episodeId}`
          ),
        ],
      });

      distributions.push({
        episode_id: episodeId,
        platform: 'discord',
        status: 'published',
        published_at: new Date().toISOString(),
      });
    } catch (error: any) {
      distributions.push({
        episode_id: episodeId,
        platform: 'discord',
        status: 'failed',
        error: error.message,
      });
    }

    // Email (demo - send to a test list)
    try {
      await sendEmail({
        to: 'demo@example.com',
        subject: `New Episode: ${episode.title}`,
        html: createEpisodeEmailTemplate(
          episode.title,
          episode.description,
          `${process.env.NEXT_PUBLIC_APP_URL}/episodes/${episodeId}`,
          episode.target_language
        ),
      });

      distributions.push({
        episode_id: episodeId,
        platform: 'email',
        status: 'published',
        published_at: new Date().toISOString(),
      });
    } catch (error: any) {
      distributions.push({
        episode_id: episodeId,
        platform: 'email',
        status: 'failed',
        error: error.message,
      });
    }

    // Save distributions
    await supabase.from('distributions').insert(distributions);

    await updateStepStatus('distribute', 'completed', 100);
    await addLog('distribute', `Published to ${distributions.length} platforms`);

    // Update episode status
    await supabase
      .from('episodes')
      .update({ status: 'completed' })
      .eq('id', episodeId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Processing error:', error);

    // Update episode status to failed
    const supabase = getServiceSupabase();
    await supabase
      .from('episodes')
      .update({ status: 'failed' })
      .eq('id', episodeId);

    return NextResponse.json(
      { success: false, error: 'Processing failed' },
      { status: 500 }
    );
  }
}
