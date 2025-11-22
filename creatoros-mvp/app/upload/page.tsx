"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploader } from '@/components/FileUploader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();

  const handleUploadComplete = (episodeId: string) => {
    // Redirect to processing page
    router.push(`/process/${episodeId}`);
  };

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

        <FileUploader onUploadComplete={handleUploadComplete} />

        {/* Info Section */}
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>
                Your file is securely uploaded and encrypted
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>
                AI transcribes and translates with cultural adaptation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>
                Voice is generated in the target language
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>
                Content is automatically distributed to all platforms
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-blue-700">
            You'll see every step happening in real-time on the next page!
          </p>
        </div>
      </div>
    </div>
  );
}
