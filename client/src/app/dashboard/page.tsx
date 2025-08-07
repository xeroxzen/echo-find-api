"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import SearchInterface from "../../components/SearchInterface";
import AudioPlayer from "../../components/AudioPlayer";

interface FileStats {
  totalFiles: number;
  totalDuration: number;
  totalTranscribed: number;
  averageConfidence: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedAudio, setSelectedAudio] = useState<{
    title: string;
    duration: number;
    audioUrl: string;
  } | null>(null);

  // I'm simulating file statistics for demo purposes
  const stats: FileStats = {
    totalFiles: 127,
    totalDuration: 2847, // in minutes
    totalTranscribed: 125,
    averageConfidence: 0.94,
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleAudioSelect = (audio: {
    title: string;
    duration: number;
    audioUrl: string;
  }) => {
    setSelectedAudio(audio);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                EchoFind Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="Notifications"
              >
                <BellIcon className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="Settings"
              >
                <CogIcon className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: FolderIcon,
              label: "Total Files",
              value: stats.totalFiles.toString(),
              color: "blue",
            },
            {
              icon: ClockIcon,
              label: "Total Duration",
              value: formatDuration(stats.totalDuration),
              color: "green",
            },
            {
              icon: DocumentTextIcon,
              label: "Transcribed",
              value: `${stats.totalTranscribed}/${stats.totalFiles}`,
              color: "purple",
            },
            {
              icon: ChartBarIcon,
              label: "Avg Confidence",
              value: `${Math.round(stats.averageConfidence * 100)}%`,
              color: "orange",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon
                    className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Results */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {[
                  { id: "search", label: "Search", icon: MagnifyingGlassIcon },
                  { id: "files", label: "Files", icon: FolderIcon },
                  { id: "analytics", label: "Analytics", icon: ChartBarIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {activeTab === "search" && <SearchInterface />}

              {activeTab === "files" && (
                <div className="p-6">
                  <div className="text-center py-12">
                    <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      File Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage and organize your voice note files
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="p-6">
                  <div className="text-center py-12">
                    <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      View insights and usage statistics
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Audio Player */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {selectedAudio ? (
                <AudioPlayer
                  audioUrl={selectedAudio.audioUrl}
                  title={selectedAudio.title}
                  duration={selectedAudio.duration}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Audio Player
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select an audio file from search results to play
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
