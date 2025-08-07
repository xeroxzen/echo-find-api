"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BackwardIcon,
  ForwardIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: number;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
}

export default function AudioPlayer({
  audioUrl,
  title,
  duration,
  currentTime = 0,
  onTimeUpdate,
  onPlay,
  onPause,
  onSeek,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // I'm simulating audio playback for demo purposes
  const [localCurrentTime, setLocalCurrentTime] = useState(currentTime);

  useEffect(() => {
    setLocalCurrentTime(currentTime);
  }, [currentTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      onPause?.();
    } else {
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    setLocalCurrentTime(newTime);
    onSeek?.(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSkip = (direction: "forward" | "backward") => {
    const skipTime = direction === "forward" ? 10 : -10;
    const newTime = Math.max(
      0,
      Math.min(duration, localCurrentTime + skipTime)
    );
    setLocalCurrentTime(newTime);
    onSeek?.(newTime);
  };

  // I'm simulating audio progress for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setLocalCurrentTime((prev) => {
          const newTime = prev + 0.1;
          if (newTime >= duration) {
            setIsPlaying(false);
            onPause?.();
            return 0;
          }
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, onTimeUpdate, onPause]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <SpeakerWaveIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(localCurrentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ClockIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            style={{ width: `${(localCurrentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-blue-600 rounded-full shadow-lg"
            style={{ left: `${(localCurrentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Skip Backward */}
          <button
            onClick={() => handleSkip("backward")}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Skip 10 seconds backward"
          >
            <BackwardIcon className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6 ml-1" />
            )}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => handleSkip("forward")}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Skip 10 seconds forward"
          >
            <ForwardIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMuteToggle}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-5 h-5" />
            ) : (
              <SpeakerWaveIcon className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              title="Volume"
            />
          </div>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="mt-6">
        <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-end justify-between h-full space-x-1">
            {Array.from({ length: 50 }, (_, i) => {
              const height = Math.random() * 100;
              const isActive = (i / 50) * duration <= localCurrentTime;

              return (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full transition-colors ${
                    isActive
                      ? "bg-gradient-to-t from-blue-600 to-purple-600"
                      : "bg-gray-300 dark:bg-gray-500"
                  }`}
                  style={{ height: `${height}%` }}
                  animate={{
                    height: isPlaying ? [height, height * 1.2, height] : height,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.02,
                  }}
                />
              );
            })}
          </div>

          {/* Playhead */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
            style={{ left: `${(localCurrentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Timestamp Navigation */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>0:00</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
