import Link from 'next/link';
import { Zap, Languages, Share2, TrendingUp, PlayCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🚀 Middleware Orchestration for Creators
            </span>
          </div>

          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CreatorOS Middleware MVP
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Transform your content into bilingual, multi-platform magic with AI-powered middleware.
            Watch the entire process happen in real-time.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/upload"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlayCircle size={20} />
              Start Demo
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Automated Processing</h3>
            <p className="text-gray-600 text-sm">
              Upload once, distribute everywhere. Save 12+ hours per episode.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Languages className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cultural Adaptation</h3>
            <p className="text-gray-600 text-sm">
              Not just translation - cultural adaptation with AI that understands context.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="text-pink-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
            <p className="text-gray-600 text-sm">
              YouTube, LinkedIn, Discord, Email, RSS - all with one click.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">2x Your Reach</h3>
            <p className="text-gray-600 text-sm">
              Reach bilingual audiences across 5+ platforms automatically.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-12">
            Watch the Magic Happen
          </h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                step: 1,
                title: 'Upload Your Content',
                description: 'Drag and drop your podcast episode (audio or video)',
                time: '30 seconds',
              },
              {
                step: 2,
                title: 'AI Transcription',
                description: 'OpenAI Whisper converts speech to text with 95%+ accuracy',
                time: '2 minutes',
              },
              {
                step: 3,
                title: 'Cultural Translation',
                description: 'GPT-4 adapts idioms, humor, and cultural references',
                time: '1 minute',
              },
              {
                step: 4,
                title: 'Voice Generation',
                description: 'ElevenLabs clones your voice in the target language',
                time: '2 minutes',
              },
              {
                step: 5,
                title: 'Multi-Platform Distribution',
                description: 'One-click publish to YouTube, LinkedIn, Discord, Email, RSS',
                time: '30 seconds',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 items-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">
                  {item.time}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-block p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-300">
              <p className="text-2xl font-bold text-green-800 mb-2">
                Total Time: ~6 minutes
              </p>
              <p className="text-gray-600">
                vs. 5+ hours of manual work
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-32 p-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to See It in Action?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Try the demo and watch your content transform in real-time
          </p>
          <Link
            href="/upload"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Demo Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
