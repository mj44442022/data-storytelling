import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const originalLanguage = formData.get('originalLanguage') as string;
    const targetLanguage = formData.get('targetLanguage') as string;

    if (!file || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const episodeId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const fileName = `${episodeId}.${fileExt}`;

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('episodes')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('episodes')
      .getPublicUrl(fileName);

    // Create episode record
    const { data: episode, error: dbError } = await supabase
      .from('episodes')
      .insert({
        id: episodeId,
        user_id: 'demo-user', // In production, get from auth
        title,
        description,
        original_language: originalLanguage,
        target_language: targetLanguage,
        audio_url: urlData.publicUrl,
        file_size: file.size,
        status: 'processing',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to create episode record' },
        { status: 500 }
      );
    }

    // Trigger processing pipeline
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/process/${episodeId}`, {
      method: 'POST',
    });

    return NextResponse.json({
      success: true,
      data: {
        episodeId,
        episode,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
