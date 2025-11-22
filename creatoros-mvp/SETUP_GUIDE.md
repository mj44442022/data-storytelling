# 📘 Complete Setup Guide - CreatorOS Middleware MVP

This guide will walk you through setting up the CreatorOS Middleware MVP from scratch.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org))
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] A Supabase account ([Sign up](https://supabase.com))
- [ ] An OpenAI account with API access ([Sign up](https://platform.openai.com))
- [ ] An ElevenLabs account ([Sign up](https://elevenlabs.io))
- [ ] (Optional) A Vercel account for deployment ([Sign up](https://vercel.com))

---

## Step 1: Install Dependencies

```bash
cd creatoros-mvp
npm install
```

This will install:
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion (for animations)
- Supabase client
- OpenAI SDK
- ElevenLabs SDK
- Platform integration libraries

---

## Step 2: Set Up Supabase

### 2.1 Create a New Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project details:
   - **Name**: CreatorOS MVP
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

### 2.2 Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: Your public API key
   - **service_role key**: Your service role key (keep this secret!)

### 2.3 Run the Database Schema

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Open the `supabase-schema.sql` file in this repository
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run"
7. You should see "Success. No rows returned"

This creates:
- All necessary tables (episodes, processing_steps, etc.)
- Indexes for performance
- Row Level Security policies
- Storage bucket for files

### 2.4 Verify Setup

1. Go to **Database** → **Tables**
2. You should see 7 tables:
   - users
   - episodes
   - processing_steps
   - transcripts
   - translations
   - generated_audio
   - distributions

3. Go to **Storage**
4. You should see an "episodes" bucket

---

## Step 3: Get API Keys

### 3.1 OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Go to **API Keys** in the left sidebar
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **Important**: Add billing information and credits

**Cost Note**:
- Whisper: $0.006/minute
- GPT-4: ~$0.03-0.10 per request
- Budget ~$10-20 for testing

### 3.2 ElevenLabs API Key

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up for a free account
3. Go to your Profile (top right)
4. Copy your API key

**Free Tier**: 10,000 characters/month (~5-10 episodes)

### 3.3 Optional Platform Keys

#### Discord Webhook (Free)
1. Go to your Discord server
2. Server Settings → Integrations → Webhooks
3. Create New Webhook
4. Copy the Webhook URL

#### Resend Email (Free)
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Get your API key
4. Free tier: 3,000 emails/month

#### YouTube/LinkedIn (Optional)
Follow their respective OAuth setup guides if needed.

---

## Step 4: Configure Environment Variables

### 4.1 Create .env.local File

```bash
cp .env.example .env.local
```

### 4.2 Edit .env.local

Open `.env.local` and fill in your keys:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI (Required)
OPENAI_API_KEY=sk-your-openai-key-here

# ElevenLabs (Required)
ELEVENLABS_API_KEY=your-elevenlabs-key-here

# Discord (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook

# Resend Email (Optional)
RESEND_API_KEY=re_your-resend-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4.3 Verify Configuration

Make sure:
- No trailing spaces in values
- All required keys are filled in
- File is saved as `.env.local` (not `.env.txt`)

---

## Step 5: Run the Development Server

### 5.1 Start the Server

```bash
npm run dev
```

You should see:
```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

### 5.2 Open the App

Visit [http://localhost:3000](http://localhost:3000)

You should see:
- The CreatorOS landing page
- Beautiful gradient design
- "Start Demo" button

---

## Step 6: Test the Application

### 6.1 Prepare Test Content

For the demo, you need a short audio or video file:
- **Format**: MP3, WAV, M4A, MP4, MOV
- **Length**: 1-2 minutes recommended for testing
- **Size**: < 50MB

**Test File Ideas**:
- Record a 1-minute voice memo on your phone
- Use a sample podcast clip
- Download a short TED talk audio

### 6.2 Upload Test

1. Click "Start Demo"
2. Drag and drop your test file
3. Fill in:
   - Title: "Test Episode"
   - Description: "Testing the CreatorOS pipeline"
   - Original Language: English
   - Target Language: Spanish
4. Click "Start Processing"

### 6.3 Watch the Magic

You should see:
1. Upload progress bar
2. Redirect to processing page
3. Animated pipeline steps:
   - ✅ Upload
   - 🔄 Transcription (takes ~1-2 min)
   - 🔄 Translation
   - 🔄 Voice Generation
   - 🔄 Formatting
   - 🔄 Distribution

### 6.4 Verify Results

Check your integrations:
- **Supabase**: Go to Table Editor → episodes (should see your episode)
- **Discord**: Check for webhook message
- **Email**: Check test email delivery

---

## Step 7: Deployment (Optional)

### 7.1 Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial CreatorOS MVP"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/creatoros-mvp.git
git branch -M main
git push -u origin main
```

### 7.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: .next

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add ALL variables from `.env.local`
   - **Important**: Add them for Production, Preview, and Development

6. Click "Deploy"

7. Wait 2-3 minutes for deployment

8. Visit your live URL: `https://your-app.vercel.app`

---

## Troubleshooting

### Issue: "Supabase connection failed"

**Solution**:
1. Verify your Supabase URL and keys in `.env.local`
2. Check Supabase dashboard is accessible
3. Ensure schema was run successfully
4. Check browser console for specific errors

### Issue: "OpenAI API error"

**Solution**:
1. Verify API key is correct (starts with `sk-`)
2. Check you have credits: [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
3. Ensure your account has access to Whisper API
4. Check rate limits

### Issue: "Upload fails"

**Solution**:
1. Check file size (must be < 50MB)
2. Verify Supabase Storage bucket "episodes" exists
3. Check storage policies in Supabase
4. Look for CORS errors in browser console

### Issue: "Processing stuck"

**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify all API keys are configured
5. Check Supabase Tables → processing_steps for status

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

---

## Performance Optimization

### For Development

1. **Use Short Test Files**: 1-2 minutes for faster iteration
2. **Enable Hot Reload**: Edit code and see changes instantly
3. **Use Browser DevTools**: Monitor network requests and performance

### For Production

1. **Enable Caching**: Supabase has built-in caching
2. **Optimize Images**: Use Next.js Image component
3. **Monitor Costs**: Set up billing alerts in OpenAI dashboard

---

## Security Checklist

- [ ] Never commit `.env.local` to Git
- [ ] Use environment variables for all secrets
- [ ] Keep Supabase service role key private
- [ ] Set up Row Level Security policies
- [ ] Use HTTPS in production
- [ ] Implement rate limiting for API routes
- [ ] Add CORS restrictions

---

## Next Steps

Once you have the MVP running:

1. **Test with real content**: Upload actual podcast episodes
2. **Customize branding**: Update colors, logos, text
3. **Add analytics**: Track usage and metrics
4. **Implement auth**: Add user authentication
5. **Scale integrations**: Add more platforms
6. **Gather feedback**: Share with potential users

---

## Support

If you get stuck:

1. Check this guide again carefully
2. Review the main README.md
3. Check browser console for errors
4. Verify all environment variables
5. Open an issue on GitHub
6. Join the community Discord (coming soon)

---

## Cost Breakdown

### Development (Testing)
- **OpenAI**: $5-10 for ~20 test episodes
- **ElevenLabs**: Free tier (10K chars)
- **Supabase**: Free tier
- **Vercel**: Free tier
- **Total**: ~$5-10

### Production (100 episodes/month)
- **OpenAI**: ~$50-60
- **ElevenLabs**: ~$30 (Creator plan)
- **Supabase**: Free tier or $25/month
- **Vercel**: Free tier
- **Total**: ~$80-115/month

---

Happy building! 🚀

Made with ❤️ for creators everywhere.
