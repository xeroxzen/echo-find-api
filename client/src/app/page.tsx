"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MicrophoneIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  CloudArrowUpIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { SpeakerWaveIcon as SpeakerWaveSolid } from "@heroicons/react/24/solid";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [topSearchQuery, setTopSearchQuery] = useState("");
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedFileId(null);
    setTranscriptText("");

    const formData = new FormData();
    formData.append("file", file);

    // Prefer Next.js local API for transcription and progress feedback, to avoid proxy redirect issues
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/transcribe");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setUploadedFileId("local");
            // Nothing to store on backend in this codepath, but we have the audio URL to play on the client
            // Client already created a blob URL for playback via the landing page
            const text =
              (typeof data?.text === "string" && data.text) ||
              (Array.isArray(data?.segments)
                ? data.segments.map((s: any) => s?.text || "").join(" ")
                : "");
            setTranscriptText(text);
          } catch (err) {
            setUploadError("Upload succeeded but parsing response failed.");
          }
        } else {
          setUploadError(`Transcription failed (${xhr.status}).`);
        }
      }
    };
    xhr.onerror = () => {
      setIsUploading(false);
      setUploadError("Network error during transcription.");
    };
    xhr.send(formData);
  };

  const goToDashboardWithQuery = () => {
    const q = topSearchQuery.trim();
    if (q) {
      router.push(`/dashboard?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <SpeakerWaveSolid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">EchoFind</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Pricing
              </a>
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Stop scrolling through{" "}
              <span className="gradient-text">endless voice notes</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              EchoFind transforms your audio messages into searchable content
              using AI transcription and semantic search. Find specific
              information in voice notes instantly - like Ctrl+F for your audio.
            </p>

            {/* Upload Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <CloudArrowUpIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Your Voice Notes
                    {uploadedFileId && (
                      <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                        (ID: {uploadedFileId})
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag and drop or click to upload audio files
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <MicrophoneIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {isUploading
                        ? "Uploading..."
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      MP3, WAV, M4A up to 100MB
                    </p>
                  </label>
                </div>

                {(isUploading || uploadProgress > 0) && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isUploading ? "Uploading..." : "Uploaded"}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    {uploadError && (
                      <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                    )}
                    {uploadedFileId && !uploadError && !isUploading && (
                      <div className="mt-3 text-sm text-green-700">
                        Uploaded file ID: <code>{uploadedFileId}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Section */}
            {transcriptText && (
              <div className="max-w-3xl mx-auto mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Transcript
                  </h3>
                  <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                    {transcriptText}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Search CTA */}
            <div className="max-w-xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search immediately (opens dashboard)..."
                    value={topSearchQuery}
                    onChange={(e) => setTopSearchQuery(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && goToDashboardWithQuery()
                    }
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={goToDashboardWithQuery}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Voice Note Search
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to find information in your audio content
              quickly and efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: SparklesIcon,
                title: "AI Transcription",
                description:
                  "Advanced speech-to-text using OpenAI Whisper for accurate transcriptions in multiple languages.",
              },
              {
                icon: MagnifyingGlassIcon,
                title: "Semantic Search",
                description:
                  "Find content by meaning, not just exact words. Understand context and intent.",
              },
              {
                icon: PlayIcon,
                title: "Instant Navigation",
                description:
                  "Jump to exact timestamps in your audio files with one click.",
              },
              {
                icon: ClockIcon,
                title: "Real-time Processing",
                description:
                  "Upload and process voice notes in seconds, not minutes.",
              },
              {
                icon: SpeakerWaveIcon,
                title: "Multi-format Support",
                description:
                  "Works with WhatsApp voice notes, meeting recordings, and call center audio.",
              },
              {
                icon: ArrowRightIcon,
                title: "Enterprise Ready",
                description:
                  "Scalable solution for call centers, meeting recordings, and large audio archives.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 card-hover"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              See EchoFind in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Watch how easy it is to find information in your voice notes
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                EchoFind Demo
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="audio-wave w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <PlayIcon className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive demo coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Voice Notes?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who have already discovered the power of
              searchable audio content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Free Trial
              </a>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <SpeakerWaveSolid className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EchoFind</span>
              </div>
              <p className="text-gray-400">
                AI-powered voice note search engine that transforms audio
                content into searchable, indexed data.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EchoFind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
