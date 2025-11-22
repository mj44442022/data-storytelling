# 🚀 CreatorOS Middleware MVP

**Transform your content into bilingual, multi-platform magic with AI-powered middleware.**

A fully functional web application that demonstrates the power of middleware orchestration for content creators. Upload once, process with AI, and distribute everywhere - all while watching the magic happen in real-time.

---

## ✨ Features

### 🎯 Core Capabilities

- **🎙️ Smart Content Ingestion** - Upload audio/video files via drag-and-drop
- **🤖 AI-Powered Processing**
  - Transcription with OpenAI Whisper (95%+ accuracy)
  - Cultural translation with GPT-4 (not just word-for-word)
  - Voice cloning with ElevenLabs (preserve your tone across languages)
- **📡 Multi-Platform Distribution**
  - YouTube, LinkedIn, Discord, Email, RSS Feed
- **👀 Real-Time Visualization** - Watch every step of the processing pipeline with educational insights
- **⏱️ Time Savings** - Save 12+ hours per episode vs. manual processing

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys
3. Run the database schema:
   - Open Supabase SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the script

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Optional: Platform APIs
DISCORD_WEBHOOK_URL=your-discord-webhook
RESEND_API_KEY=your-resend-api-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📖 Usage Guide

### Basic Workflow

1. **Visit the Homepage** - See the value proposition
2. **Click "Start Demo"** - Navigate to upload page
3. **Upload Your Content** - Drag and drop audio/video file
4. **Watch the Magic** - Real-time processing visualization
5. **View Results** - See success metrics and published content

---

## 🎬 Demo Script

Perfect for showing to investors or users:

**Setup** (30 seconds)
> "This is CreatorOS - middleware that orchestrates your entire content workflow."

**Upload** (1 minute)
> "I'm uploading this podcast episode. Instead of 5 hours of manual work, watch what happens..."

**Processing** (3 minutes)
> "See the middleware in action:
> - 95%+ accurate transcription
> - Cultural translation (not just word-for-word)
> - Voice cloning in target language
> - Multi-platform formatting
> - Simultaneous distribution"

**Results** (1 minute)
> "Done! 5 platforms. 2 languages. 5 minutes. What took 5 hours now takes 5 minutes."

---

## 📁 Project Structure

```
creatoros-mvp/
├── app/
│   ├── api/              # API routes
│   ├── upload/           # Upload page
│   ├── process/[id]/     # Processing visualization
│   └── page.tsx          # Landing page
├── components/
│   ├── ProcessingPipeline.tsx  # ⭐ Visual showcase
│   └── FileUploader.tsx        # Upload component
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── openai.ts        # OpenAI integration
│   ├── elevenlabs.ts    # ElevenLabs integration
│   └── platforms/       # Platform integrations
└── types/               # TypeScript types
```

---

## 🚢 Deployment to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Detailed instructions in the full documentation.

---

## 💰 Cost Estimates

**Per Episode (30 min audio)**: ~$0.53
- OpenAI Whisper: $0.18
- GPT-4: $0.05-0.15
- ElevenLabs: $0.30

**Infrastructure**: Free tier (Supabase + Vercel)

---

## 🗺️ Roadmap

### Phase 2
- User authentication
- Dashboard with analytics
- More languages
- More platforms
- Batch processing

### Phase 3
- Community features
- Monetization
- Mobile app
- API for developers

---

## 🎯 Success Metrics

✅ Upload → Transcribe → Translate → Voice → Distribute
✅ < 15 minutes total processing time
✅ Engaging visual pipeline
✅ Educational insights
✅ Professional quality output

---

## 📝 License

MIT License - feel free to use for your own projects!

---

Made with ❤️ for creators everywhere.
