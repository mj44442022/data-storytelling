import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const from = params.from || process.env.RESEND_FROM_EMAIL || 'noreply@creatoros.com';

    await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
}

export function createEpisodeEmailTemplate(
  title: string,
  description: string,
  episodeUrl: string,
  language: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
          }
          .content {
            padding: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: #3B82F6;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎙️ New Episode Available!</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p>${description}</p>
          <p><strong>Language:</strong> ${language === 'en' ? 'English' : 'Spanish'}</p>
          <center>
            <a href="${episodeUrl}" class="cta-button">
              🎧 Listen Now
            </a>
          </center>
        </div>
        <div class="footer">
          <p>You're receiving this because you subscribed to our podcast.</p>
          <p>Powered by CreatorOS Middleware</p>
        </div>
      </body>
    </html>
  `;
}

export async function sendBulkEmails(
  subscribers: string[],
  subject: string,
  html: string
): Promise<number> {
  let sent = 0;

  // Send in batches to avoid rate limits
  const batchSize = 100;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    try {
      await sendEmail({
        to: batch,
        subject,
        html,
      });
      sent += batch.length;
    } catch (error) {
      console.error(`Failed to send batch ${i / batchSize + 1}:`, error);
    }

    // Add delay between batches
    if (i + batchSize < subscribers.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return sent;
}
