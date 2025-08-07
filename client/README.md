# EchoFind - AI-Powered Voice Note Search Engine

Stop scrolling through endless voice notes. EchoFind transforms your audio messages into searchable content using OpenAI Whisper and semantic search. Upload voice notes, get instant text search with timestamp navigation - like Ctrl+F for your audio.

🎯 **Problem**: Finding specific information in voice messages requires listening to everything  
🚀 **Solution**: AI transcription + smart search + instant audio navigation  
💼 **Use Cases**: WhatsApp voice notes → Meeting recordings → Call center analytics

## Tech Stack

- **Frontend**: Next.js 15 • React 19 • TypeScript
- **Styling**: Tailwind CSS v4 • Framer Motion • Heroicons
- **UI Components**: Radix UI • Custom Components
- **Backend**: FastAPI • OpenAI Whisper • ChromaDB • Elasticsearch • PostgreSQL

## Features

### 🎨 Beautiful & Intuitive UI

- **Modern Design**: Clean, responsive interface with dark mode support
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Mobile Responsive**: Optimized for all device sizes

### 🔍 Advanced Search Interface

- **Semantic Search**: Find content by meaning, not just exact words
- **Real-time Results**: Instant search with highlighted matches
- **Advanced Filters**: Filter by file type, date, duration, and confidence
- **Sort Options**: Sort by relevance, date, duration, or confidence score

### 🎵 Audio Player

- **Waveform Visualization**: Visual representation of audio with animated bars
- **Timestamp Navigation**: Click to jump to specific moments in audio
- **Playback Controls**: Play, pause, skip forward/backward, volume control
- **Progress Tracking**: Real-time progress bar with seek functionality

### 📊 Dashboard Analytics

- **File Statistics**: Total files, duration, transcription status
- **Confidence Metrics**: Average transcription accuracy
- **Usage Insights**: Track your voice note processing

### 📁 File Management

- **Upload Interface**: Drag & drop or click to upload audio files
- **Progress Tracking**: Real-time upload and processing status
- **Format Support**: MP3, WAV, M4A up to 100MB
- **Batch Processing**: Handle multiple files simultaneously

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page with hero section
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard interface
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── globals.css           # Global styles and Tailwind config
│   └── components/
│       ├── SearchInterface.tsx   # Advanced search component
│       └── AudioPlayer.tsx       # Audio player with waveform
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## Key Components

### SearchInterface

- **Purpose**: Main search functionality with filters and results
- **Features**:
  - Real-time search with debouncing
  - Result highlighting with search terms
  - Filter and sort options
  - Empty states and loading indicators

### AudioPlayer

- **Purpose**: Audio playback with advanced controls
- **Features**:
  - Waveform visualization with animations
  - Timestamp navigation
  - Volume control and mute
  - Skip forward/backward buttons

### Dashboard

- **Purpose**: Main application interface
- **Features**:
  - Statistics overview cards
  - Tabbed interface (Search, Files, Analytics)
  - Responsive grid layout
  - Sticky audio player sidebar

## Design System

### Colors

- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Gray scale with dark mode support
- **Accent**: Purple and cyan for highlights

### Typography

- **Font**: Geist Sans (system font fallback)
- **Weights**: Regular, Medium, Semibold, Bold
- **Sizes**: Responsive scale from 12px to 64px

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover states
- **Inputs**: Clean borders with focus rings
- **Animations**: Smooth transitions and micro-interactions

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Descriptive alt text for all images and icons

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Analysis**: Optimized imports and tree shaking
- **Caching**: Static generation and incremental static regeneration
- **Animations**: Hardware-accelerated CSS transforms

## Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced analytics and insights
- [ ] API integration with backend services
- [ ] Offline support with service workers
- [ ] Voice commands and AI assistance
- [ ] Multi-language support
- [ ] Advanced audio processing features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

⭐ **Star if you're tired of scrolling through voice notes!**
