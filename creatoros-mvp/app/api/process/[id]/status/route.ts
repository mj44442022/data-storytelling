import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const episodeId = params.id;
    const supabase = getServiceSupabase();

    // Get episode
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

    // Get all processing steps
    const { data: steps } = await supabase
      .from('processing_steps')
      .select('*')
      .eq('episode_id', episodeId);

    // Convert array to object keyed by step_id
    const stepsObj = steps?.reduce((acc: any, step: any) => {
      acc[step.step_id] = {
        status: step.status,
        progress: step.progress,
        logs: step.logs,
        error: step.error,
        startedAt: step.started_at,
        completedAt: step.completed_at,
      };
      return acc;
    }, {}) || {};

    // Get distributions for metrics
    const { data: distributions } = await supabase
      .from('distributions')
      .select('*')
      .eq('episode_id', episodeId);

    const metrics = {
      total_reach: 15234, // Mock data
      languages: 2,
      platforms: distributions?.length || 0,
      time_saved_hours: 12,
    };

    return NextResponse.json({
      success: true,
      status: episode.status,
      steps: stepsObj,
      metrics,
      episode,
    });
  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
