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

  // I'm simulating search results for demo purposes
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Team Meeting - Q4 Planning",
      timestamp: "2:34",
      duration: "45:23",
      transcript:
        "So for the Q4 planning, we need to focus on three main areas: product development, marketing strategy, and customer retention. The product team has been working on the new features that we discussed last week...",
      confidence: 0.95,
      audioUrl: "/audio/meeting-1.mp3",
    },
    {
      id: "2",
      title: "Customer Call - Support Issue",
      timestamp: "1:15",
      duration: "12:45",
      transcript:
        "I understand your frustration with the login issue. Let me help you troubleshoot this step by step. First, can you try clearing your browser cache and cookies?",
      confidence: 0.92,
      audioUrl: "/audio/call-1.mp3",
    },
    {
      id: "3",
      title: "WhatsApp Voice Note - Project Update",
      timestamp: "0:45",
      duration: "3:22",
      transcript:
        "Hey team, just wanted to give you a quick update on the project. We're ahead of schedule and should be able to deliver the beta version by next Friday.",
      confidence: 0.88,
      audioUrl: "/audio/whatsapp-1.mp3",
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // I'm simulating API call delay
    setTimeout(() => {
      const filteredResults = mockResults.filter(
        (result) =>
          result.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handlePlayAudio = (audioId: string) => {
    setPlayingAudio(playingAudio === audioId ? null : audioId);
    // I'm simulating audio playback - in real implementation, this would control actual audio
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
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
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
    </div>
  );
}
