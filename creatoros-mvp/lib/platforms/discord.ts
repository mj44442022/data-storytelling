import axios from 'axios';

export interface DiscordMessageParams {
  content: string;
  embeds?: DiscordEmbed[];
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  footer?: {
    text: string;
  };
}

export async function sendToDiscord(
  params: DiscordMessageParams,
  webhookUrl?: string
): Promise<boolean> {
  try {
    const url = webhookUrl || process.env.DISCORD_WEBHOOK_URL;

    if (!url) {
      throw new Error('Discord webhook URL not configured');
    }

    await axios.post(url, params);

    return true;
  } catch (error) {
    console.error('Discord message error:', error);
    throw new Error('Failed to send Discord message');
  }
}

export function createEpisodeEmbed(
  title: string,
  description: string,
  episodeUrl: string,
  thumbnailUrl?: string
): DiscordEmbed {
  return {
    title,
    description,
    url: episodeUrl,
    color: 0x3b82f6, // Blue
    thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined,
    fields: [
      {
        name: '🎧 Listen Now',
        value: episodeUrl,
        inline: false,
      },
    ],
    footer: {
      text: 'CreatorOS Middleware',
    },
  };
}
