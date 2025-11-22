export type ProcessingStatus = 'pending' | 'active' | 'completed' | 'error';

export type Language = 'en' | 'es';

export interface PipelineStep {
  id: string;
  title: string;
  description: string;
  status: ProcessingStatus;
  progress?: number;
  logs?: string[];
  educationalNote?: string;
  technicalDetails?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface Episode {
  id: string;
  user_id: string;
  title: string;
  description: string;
  original_language: Language;
  target_language: Language;
  audio_url: string;
  file_size: number;
  duration?: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ProcessingStepRecord {
  id: string;
  episode_id: string;
  step_id: string;
  status: ProcessingStatus;
  progress?: number;
  logs?: string[];
  error?: string;
  started_at?: string;
  completed_at?: string;
  updated_at: string;
}

export interface Transcript {
  id: string;
  episode_id: string;
  language: Language;
  text: string;
  segments?: TranscriptSegment[];
  created_at: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface Translation {
  id: string;
  episode_id: string;
  original_language: Language;
  target_language: Language;
  original_text: string;
  translated_text: string;
  cultural_adaptations?: CulturalAdaptation[];
  created_at: string;
}

export interface CulturalAdaptation {
  original: string;
  adapted: string;
  reason: string;
  position: number;
}

export interface GeneratedAudio {
  id: string;
  episode_id: string;
  language: Language;
  audio_url: string;
  duration: number;
  voice_id: string;
  created_at: string;
}

export interface Distribution {
  id: string;
  episode_id: string;
  platform: Platform;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  platform_url?: string;
  metadata?: Record<string, any>;
  published_at?: string;
  error?: string;
  created_at: string;
}

export type Platform = 'youtube' | 'linkedin' | 'discord' | 'email' | 'rss';

export interface PlatformConfig {
  platform: Platform;
  enabled: boolean;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface DistributionMetrics {
  total_reach: number;
  languages: number;
  platforms: number;
  time_saved_hours: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  platform_connections?: PlatformConfig[];
  created_at: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
