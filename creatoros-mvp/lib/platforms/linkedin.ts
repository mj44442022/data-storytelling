import axios from 'axios';

export interface LinkedInPostParams {
  text: string;
  imageUrl?: string;
  videoUrl?: string;
}

export async function postToLinkedIn(
  params: LinkedInPostParams,
  accessToken: string,
  userId: string
): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: `urn:li:person:${userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: params.text,
            },
            shareMediaCategory: params.imageUrl ? 'IMAGE' : 'NONE',
            media: params.imageUrl
              ? [
                  {
                    status: 'READY',
                    originalUrl: params.imageUrl,
                  },
                ]
              : [],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    const postId = response.data.id;
    return `https://www.linkedin.com/feed/update/${postId}`;
  } catch (error) {
    console.error('LinkedIn post error:', error);
    throw new Error('Failed to post to LinkedIn');
  }
}

export function getLinkedInAuthUrl(): string {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI!);
  const scope = encodeURIComponent('w_member_social r_liteprofile');

  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
}

export async function getLinkedInTokenFromCode(code: string): Promise<any> {
  const response = await axios.post(
    'https://www.linkedin.com/oauth/v2/accessToken',
    null,
    {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      },
    }
  );

  return response.data;
}
