# EchoCraft – AI Podcast Generator

Visit Project :
https://famous-trifle-7f1eb6.netlify.app//
_________
youtube video link:
https://youtu.be/Pz7Pnqrwdo8?si=SIh2VzQ9mBRt0CFf
- Admin login : 
- username : admin@example.com
- password : admin123

user login:
- username : tasnim.shaikh@cumminscollege.in
- password : guest123
________________________________________________________

**Crafting podcasts from thoughts using AI**  
An innovative AI-powered platform that automatically transforms text or topic ideas into high-quality, human-like podcasts with customizable voices, multilingual support, and seamless audio generation through Murf AI integration.

---

## Project Overview

**EchoCraft** is an intelligent content creation platform built with **React.js**, **Node.js**, and **Murf AI**. It enables users to generate professional-grade podcasts effortlessly by converting text scripts or generated content into lifelike audio in multiple languages and voices (male or female).  

The system supports:  
- Segment-wise audio generation  
- Automatic merging of all segments into a single final file  
- Playback options for both individual and combined outputs  

**Use Case:** Designed for creators, educators, and businesses seeking an efficient way to produce engaging, multilingual podcast content without requiring manual recording or editing.

---
**Directory and File structure**
____________________________________________
![WhatsApp Image 2025-10-11 at 13 41 52_52bedc8d](https://github.com/user-attachments/assets/2106832b-daf5-4160-a290-43bd67834ac3)

## Features

**Architecture**
___________________________________
<img width="458" height="432" alt="image" src="https://github.com/user-attachments/assets/4c42f757-e6b6-4926-93bc-2bd4439e1467" />

### Core
- **AI Script Generation:** Automatically generate podcast scripts using Google Gemini, based on user-provided topics or text prompts  
- **Multilingual Voice Synthesis:** Convert scripts into lifelike podcasts in multiple languages using Murf AI  
- **Voice Customization:** Choose male or female voices for each language  
- **Audio Merging:** Combine all segments into a single audio file using Fluent-ffmpeg  
- **Playback Options:** Listen to the final merged audio directly within the app  
- **Cloud Storage & Access:** Generated audio is automatically uploaded to Firebase Storage  
- **Topic-Based Podcast Creation:** Input any topic, and the system generates a complete podcast script and narration  
- **Real-Time Progress Updates:** Live display during script generation, voice synthesis, and merging  
- **Error Handling & Retry Logic:** Graceful management of failed API requests  

### UI/UX
- Modern and responsive design using **React.js** and **Tailwind CSS**  
- Intuitive dashboard for creating, previewing, and managing podcasts  
- Smooth animations with **Framer Motion**  
- Minimalist theme with clear content areas  
- Built-in audio player for playback  
- Upload and history view to access previous sessions  

---

## Tech Stack

### Frontend
- **React.js** – dynamic UI for podcast generation and playback  
- **JavaScript / JSX** – core scripting and component logic  
- **Tailwind CSS** – utility-first styling  
- **Framer Motion** – smooth animations and transitions  
- **React Icons** – iconography for UI interactions  
- **Firebase** – data storage and file management  

### Backend
- **Node.js** – runtime environment  
- **Express.js** – RESTful API for audio generation and merging  
- **Firebase Realtime Database** – user data and podcast metadata storage  
- **Firebase Storage** – secure audio file storage and retrieval  

### AI/ML Integrations
- **Google Gemini API** – podcast script generation  
- **Murf AI API** – text-to-speech with multilingual and gender-based voices  
- **Fluent-ffmpeg** – audio processing and merging  

### Utilities & Tooling
- **dotenv** – environment variable management  
- **Axios** – API request handling  

### Deployment
- **Firebase Hosting** – frontend deployment  
- **Node.js server** – backend API hosting  
- **Git/GitHub** – version control  

---

## Podcast Generation Flow
1. User selects topic, style, language, and voice.  
2. Frontend sends request to `/api/generate-script`.  
3. Generated script is returned and displayed for review/editing.  
4. Script is sent to `/api/generate-audio` or `/api/generate-segmented-audio`.  
5. Generated audio (segments or merged) is returned and playable in the UI.  
6. User can download the final podcast audio.  

---

## Custom Hooks
- `usePodcastLogic` – manages script/audio generation and segment handling  
- `useSidebarState` – sidebar open/close state  
- `useAudioPlayer` – playback, merging, segment navigation  
- `use-toast`, `use-mobile` – notifications and responsive utilities  

---

## Data Models & Types
- `Voices`, `Languages`, `Styles` – `data/voices.ts`, `data/languages.ts`, `data/styles.ts`  
- Main Types – `Script`, `AudioSegment`, `PodcastEpisode`, `UserSession`  
- Validation helpers for script length, segment count, and audio duration  

---

## Development & Setup

### Prerequisites
- Node.js v18+  
- npm  
- Google Gemini API key  
- Murf AI API key  ## AI & ML Integrations
- **Google Gemini AI**: Script generation from topics and prompts (`lib/gemini.ts`)  
- **Murf AI**: Text-to-Speech for audio generation (`lib/murf.ts`)  

---

## Podcast Generation Flow
1. User selects **topic, style, language, and voice** in the UI.  
2. Frontend sends request to `/api/generate-script`.  
3. Generated script is returned and displayed in the **script editor**.  
4. User can **edit the script manually**.  
5. Frontend sends script to `/api/generate-audio` or `/api/generate-segmented-audio`.  
6. Generated audio (segments or merged) is returned and **playable in the UI**.  
7. User can **download the final podcast audio**.  

---

## Session Management & History
- **Session State**: Managed in React state and persisted to `localStorage`.  
- **History**: Completed sessions (script, audio, style, user edits) are saved for replay.  
- **Session Analysis**: Users can view summaries of generated podcasts, including duration, segments, and edits.  

---

## Scripts & Utilities
- `scripts/test-script-generation.js` – Tests Gemini AI script generation with sample topics.  
- `scripts/merge-audio.js` – Merges segmented audio files into a single final podcast.  

---

## Development, Setup & Testing

### Prerequisites
- Node.js v18+  
- npm  
- Google Gemini API key  
- Murf AI API key  

### Setup
```bash
git clone https://github.com/yourusername/ai-podcast-generator.git
cd ai-podcast-generator
npm install

git clone https://github.com/yourusername/ai-podcast-generator.git
cd ai-podcast-generator
npm install
