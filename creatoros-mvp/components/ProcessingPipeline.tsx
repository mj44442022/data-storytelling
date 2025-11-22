"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { PipelineStep, DistributionMetrics } from '@/types';

interface ProcessingPipelineProps {
  episodeId: string;
  onComplete?: () => void;
}

export function ProcessingPipeline({ episodeId, onComplete }: ProcessingPipelineProps) {
  const [steps, setSteps] = useState<PipelineStep[]>([
    {
      id: 'upload',
      title: 'Secure Storage Upload',
      description: 'Encrypting and uploading your content',
      status: 'pending',
      educationalNote: 'Your content is encrypted end-to-end before upload using industry-standard AES-256 encryption to ensure maximum security.',
      technicalDetails: 'Using Supabase Storage with AES-256 encryption | File chunking for optimal upload speed',
    },
    {
      id: 'transcribe',
      title: 'AI Transcription',
      description: 'Converting audio to text with OpenAI Whisper',
      status: 'pending',
      educationalNote: 'Whisper achieves 95%+ accuracy by analyzing audio patterns, detecting speaker changes, and correcting common speech patterns automatically.',
      technicalDetails: 'Model: whisper-1 | Language: auto-detect | Processing: ~1 min per 10 min audio',
    },
    {
      id: 'translate',
      title: 'Cultural Translation',
      description: 'Adapting content for target culture',
      status: 'pending',
      educationalNote: 'We adapt idioms, humor, and cultural references - not just word-for-word translation. Example: "piece of cake" becomes "pan comido" in Spanish.',
      technicalDetails: 'Using GPT-4 with custom cultural adaptation prompts | Temperature: 0.7 | Max tokens: 4000',
    },
    {
      id: 'voice',
      title: 'Voice Generation',
      description: 'Creating authentic bilingual audio',
      status: 'pending',
      educationalNote: 'Your voice characteristics are preserved across languages using advanced AI voice cloning that maintains your unique tone, pacing, and personality.',
      technicalDetails: 'ElevenLabs voice cloning with emotion preservation | Model: eleven_multilingual_v2',
    },
    {
      id: 'format',
      title: 'Multi-Platform Formatting',
      description: 'Optimizing for each platform',
      status: 'pending',
      educationalNote: 'Each platform has unique requirements we handle automatically - video specs, thumbnail sizes, text limits, and more.',
      technicalDetails: 'YouTube: 1080p H.264 | LinkedIn: 1200x628 | Discord: Rich embeds | Email: Responsive HTML',
    },
    {
      id: 'distribute',
      title: 'Distribution',
      description: 'Publishing across all connected platforms',
      status: 'pending',
      educationalNote: 'One-click distribution maintains consistency across all platforms while respecting each platform\'s unique best practices.',
      technicalDetails: 'Parallel API calls with exponential backoff retry logic | Max retries: 3 | Timeout: 30s',
    },
  ]);

  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [metrics, setMetrics] = useState<DistributionMetrics>({
    total_reach: 0,
    languages: 0,
    platforms: 0,
    time_saved_hours: 0,
  });

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/process/${episodeId}/status`);
        const data = await response.json();

        if (data.success && data.steps) {
          setSteps((prevSteps) =>
            prevSteps.map((step) => ({
              ...step,
              ...data.steps[step.id],
            }))
          );

          if (data.metrics) {
            setMetrics(data.metrics);
          }

          // Stop polling when complete
          if (data.status === 'completed') {
            clearInterval(interval);
            onComplete?.();
          }
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [episodeId, onComplete]);

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Loader2 className="animate-spin text-white" size={24} />;
      case 'completed':
        return <Check className="text-white" size={24} />;
      case 'error':
        return <AlertCircle className="text-white" size={24} />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-200';
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'error':
        return 'bg-red-500 border-red-500';
      default:
        return 'bg-gray-200 border-gray-200';
    }
  };

  const getContainerColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const allStepsCompleted = steps.every((s) => s.status === 'completed');

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Processing Your Content
          </h2>
          <p className="text-gray-600 mt-2">
            Watch the middleware magic happen in real-time
          </p>
        </div>
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Info size={20} />
          {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
        </button>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-xl border-2 transition-all ${getContainerColor(step.status)}`}
          >
            {/* Status Icon */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${getStatusColor(step.status)}`}>
                {getStatusIcon(step.status)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  {step.status !== 'pending' && (
                    <button
                      onClick={() => toggleStepExpansion(step.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {expandedSteps.has(step.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{step.description}</p>

                {/* Progress Bar */}
                {step.status === 'active' && step.progress !== undefined && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                {/* Educational Note */}
                <div className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{step.educationalNote}</p>
                  </div>
                </div>

                {/* Technical Details (Collapsible) */}
                <AnimatePresence>
                  {showTechnicalDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-xs">
                        <div className="mb-1 text-gray-500">// Technical Details</div>
                        {step.technicalDetails}
                        {step.logs && step.logs.length > 0 && (
                          <div className="mt-2">
                            <div className="text-gray-500">// Recent Logs</div>
                            {step.logs.slice(-3).map((log, i) => (
                              <div key={i} className="text-green-400">
                                {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedSteps.has(step.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        {step.startedAt && (
                          <div className="mb-1">
                            <strong>Started:</strong> {new Date(step.startedAt).toLocaleTimeString()}
                          </div>
                        )}
                        {step.completedAt && (
                          <div className="mb-1">
                            <strong>Completed:</strong> {new Date(step.completedAt).toLocaleTimeString()}
                          </div>
                        )}
                        {step.error && (
                          <div className="text-red-600 mt-2">
                            <strong>Error:</strong> {step.error}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Real-time Activity */}
                {step.status === 'active' && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    Processing...
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line to Next Step */}
            {index < steps.length - 1 && (
              <div className="absolute left-10 top-full w-0.5 h-6 bg-gray-300" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Summary */}
      {allStepsCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-300"
        >
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            🎉 Processing Complete!
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.languages || 2}
              </div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.platforms || 5}
              </div>
              <div className="text-sm text-gray-600">Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.time_saved_hours || 12}
              </div>
              <div className="text-sm text-gray-600">Hours Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {(metrics.total_reach / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-gray-600">Total Reach</div>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = `/episodes/${episodeId}`)}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            View Your Published Content →
          </button>
        </motion.div>
      )}
    </div>
  );
}
