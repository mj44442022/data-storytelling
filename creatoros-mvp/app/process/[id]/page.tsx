"use client";

import { useParams } from 'next/navigation';
import { ProcessingPipeline } from '@/components/ProcessingPipeline';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProcessPage() {
  const params = useParams();
  const episodeId = params.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <ProcessingPipeline
          episodeId={episodeId}
          onComplete={() => {
            console.log('Processing complete!');
          }}
        />
      </div>
    </div>
  );
}
