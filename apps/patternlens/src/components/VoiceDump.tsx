"use client";

import { useState, useCallback } from "react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useTranscription } from "@/hooks/useTranscription";

interface VoiceDumpProps {
  onTranscript: (text: string) => void;
  onRecordingStart?: () => void;
  onRecordingEnd?: () => void;
  disabled?: boolean;
  maxDuration?: number; // seconds
}

export function VoiceDump({
  onTranscript,
  disabled = false,
  maxDuration = 120
}: VoiceDumpProps) {
  const [error, setError] = useState<string | null>(null);

  const { transcribe, isTranscribing } = useTranscription({
    onSuccess: (text) => {
      onTranscript(text);
      setError(null);
    },
    onError: (err) => setError(err.message),
  });

  const handleRecordingComplete = useCallback((blob: Blob) => {
    transcribe(blob);
  }, [transcribe]);

  const {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useMediaRecorder({
    onRecordingComplete: handleRecordingComplete,
    maxDuration,
    onMaxDurationReached: () => setError(`Maximum ${maxDuration}s reached`),
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isProcessing = isTranscribing;
  const isDisabled = disabled || isProcessing;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-red-400">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="font-mono text-sm">{formatDuration(duration)}</span>
          {isPaused && <span className="text-xs text-slate-400">(paused)</span>}
        </div>
      )}

      {/* Main controls */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isDisabled}
            className="flex items-center justify-center w-14 h-14 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full transition-colors"
            aria-label="Start recording"
          >
            <MicIcon className="w-6 h-6 text-white" />
          </button>
        ) : (
          <>
            {/* Pause/Resume */}
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex items-center justify-center w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <PlayIcon className="w-5 h-5 text-white" />
              ) : (
                <PauseIcon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Stop */}
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-14 h-14 bg-slate-800 hover:bg-slate-700 border-2 border-red-500 rounded-full transition-colors"
              aria-label="Stop recording"
            >
              <StopIcon className="w-6 h-6 text-red-500" />
            </button>
          </>
        )}
      </div>

      {/* Status */}
      {isTranscribing && (
        <p className="text-sm text-slate-400 animate-pulse">
          Processing audio...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Instructions */}
      {!isRecording && !isProcessing && (
        <p className="text-xs text-slate-500 text-center max-w-[240px] sm:max-w-[200px]">
          Record your voice to document the Object
        </p>
      )}
    </div>
  );
}

// Icons
function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
