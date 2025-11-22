import { google } from 'googleapis';

const youtube = google.youtube('v3');

export interface YouTubeUploadParams {
  title: string;
  description: string;
  videoFile: Buffer;
  tags?: string[];
  categoryId?: string;
}

export async function uploadToYouTube(
  params: YouTubeUploadParams,
  accessToken: string
): Promise<string> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const response = await youtube.videos.insert({
      auth: oauth2Client,
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: params.title,
          description: params.description,
          tags: params.tags || [],
          categoryId: params.categoryId || '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        body: params.videoFile as any,
      },
    });

    const videoId = response.data.id;
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    console.error('YouTube upload error:', error);
    throw new Error('Failed to upload to YouTube');
  }
}

export function getYouTubeAuthUrl(): string {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

export async function getYouTubeTokenFromCode(code: string): Promise<any> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}
