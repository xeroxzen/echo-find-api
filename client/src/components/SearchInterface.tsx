"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  ClockIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

interface SearchResult {
  id: string;
  title: string;
  timestamp: string;
  duration: string;
  transcript: string;
  confidence: number;
  audioUrl: string;
}

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptQuery, setTranscriptQuery] = useState<string>("");

  const formatSeconds = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(1, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: "20",
        offset: "0",
      });
      const res = await fetch(`/api/v1/search?${params.toString()}`);
      if (!res.ok) throw new Error(`Search failed with ${res.status}`);
      const data: {
        success: boolean;
        results: Array<{
          file_id: string;
          filename: string;
          transcript_segment: string;
          start_time: number;
          end_time: number;
          confidence_score: number;
          upload_time: string;
        }>;
        total_count: number;
        query: string;
        took_ms: number;
      } = await res.json();

      const mapped: SearchResult[] = (data.results || []).map((r) => {
        const durationSeconds = Math.max(
          0,
          (r.end_time ?? 0) - (r.start_time ?? 0)
        );
        return {
          id: r.file_id,
          title: r.filename || r.file_id,
          timestamp: formatSeconds(r.start_time ?? 0),
          duration: formatSeconds(durationSeconds || 0),
          transcript: r.transcript_segment,
          confidence: r.confidence_score ?? 0,
          audioUrl: `/api/v1/playback/${r.file_id}`,
        };
      });

      setResults(mapped);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayAudio = (audioId: string) => {
    const next = playingAudio === audioId ? null : audioId;
    setPlayingAudio(next);
    const selected = results.find((r) => r.id === audioId);
    if (next && selected) {
      window.open(selected.audioUrl, "_blank");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/v1/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Upload failed with ${res.status}`);
      const data: {
        success: boolean;
        file_id?: string;
        audio_file?: { id: string };
      } = await res.json();
      const fid = data.file_id || data.audio_file?.id || null;
      setUploadedFileId(fid);

      if (fid) {
        // Try to fetch transcript for this uploaded file
        const tr = await fetch(`/api/v1/playback/${fid}/transcript`);
        if (tr.ok) {
          const tjson = (await tr.json()) as { transcript?: string };
          setTranscript(tjson.transcript || "");
        } else {
          setTranscript("");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderHighlightedTranscript = (text: string, query: string) => {
    if (!query) return text;
    const pattern = new RegExp(
      `(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(pattern);
    return parts.map((part, i) =>
      pattern.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Upload + Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Upload Input */}
          <div className="flex items-center">
            <label htmlFor="audio-upload" className="sr-only">
              Upload audio
            </label>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleUpload}
              aria-label="Upload audio"
              title="Upload audio"
              className="text-sm text-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your voice notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <label
              htmlFor="filter-select"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Filter:
            </label>
            <select
              id="filter-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Files</option>
              <option value="meetings">Meetings</option>
              <option value="calls">Calls</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-500" />
            <label
              htmlFor="sort-select"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="duration">Duration</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {result.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {result.duration}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>Timestamp: {result.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SpeakerWaveIcon className="w-4 h-4" />
                        <span>
                          Confidence: {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(result.id)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {playingAudio === result.id ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                    <span>Play</span>
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {highlightText(result.transcript, searchQuery)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isSearching && results.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filters
          </p>
        </motion.div>
      )}

      {/* Initial State */}
      {!isSearching && results.length === 0 && !searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SpeakerWaveIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Search Your Voice Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search term above to find specific content in your audio
            files
          </p>
        </motion.div>
      )}

      {/* Transcription Section */}
      {uploadedFileId && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transcript
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Highlight in transcript..."
                value={transcriptQuery}
                onChange={(e) => setTranscriptQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
            {transcript ? (
              renderHighlightedTranscript(transcript, transcriptQuery)
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No transcript available yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
