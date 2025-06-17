# 🚀 NoteWise – AI-Powered Notes Application

> **Submission for Frontend Task – Playpower Labs**

A modern, responsive, and AI-powered note-taking application built with **React + TypeScript**.  
This project demonstrates advanced features including a **custom rich text editor**, note encryption, **AI-enhanced insights**, and **voice input**, all packed into a seamless user experience.

---

## 🌐 Live Project

You can access the deployed project here:  
🔗 [NoteWise Live on Vercel](https://notewise-eta.vercel.app/)

---

## 📌 What I Have Built

### 📝 Custom Rich Text Editor
- Built **from scratch** without third-party libraries (like Quill or TinyMCE).
- Supports **bold**, *italic*, _underline_, **text alignment** (left, center, right), and **font size adjustments**.
- Smooth, intuitive editing experience using native DOM APIs and React state management.

### 📚 Note Management
- **Create**, **Edit**, **Delete**, and **List** notes.
- **Pin notes** to the top with a pin icon indicator.
- **Encrypt notes** with a password for added privacy and security.

### 🤖 AI-Powered Features (Gemini)
- 🔍 **Auto Glossary Highlighting**: Automatically detects key terms and highlights them with **tooltip definitions** on hover.
- 📌 **AI-Driven Insights**: Uses **Google Gemini API** to generate:
  - Summaries  
  - Key points  
  - Related concepts  
- ✅ **Grammar Check**: Detects grammatical errors, underlines them, and offers real-time suggestions.

### 🎤 Speech-to-Text
- Integrated **SpeechRecognition API** (browser-native).
- Users can **dictate** notes using voice, enhancing accessibility and productivity.

### 📱 Responsive Design
- Mobile-first design with **Tailwind CSS**.
- Optimized for **desktop, tablet, and smartphone** usage.
- Smooth touch and keyboard interactions.

### 💾 Data Persistence
- Notes and user preferences are stored using **browser’s localStorage**.
- Ensures continuity between sessions without requiring a backend.

---

## 🛠️ Technologies Used

| Category              | Tools / Frameworks                     |
|-----------------------|----------------------------------------|
| **Frontend**          | React (with TypeScript)                |
| **Styling**           | Tailwind CSS                           |
| **AI Integration**    | Google **Gemini API**                  |
| **Voice Recognition** | Web Speech API                         |
| **State Management**  | React Hooks, Context API               |
| **Data Storage**      | `localStorage`                         |
| **No Editors Used**   | ❌ No Quill, TinyMCE, or similar libs  |

---

## ✨ Unique and Noteworthy Features

- 💻 **Custom Rich Text Editor**  
  Crafted from the ground up using raw JavaScript and React, providing fine control over formatting and editing.

- 🧠 **Gemini AI Integration**  
  Real-time summarization, keyword extraction, grammar suggestions, and glossary definitions using Google's Gemini Pro API.

- 📘 **Glossary Highlighting**  
  Learn while writing — auto-highlighted terms with definitions create an **interactive learning experience**.

- 🗣️ **Voice Input (Speech-to-Text)**  
  Dictate notes hands-free, improving accessibility and enabling faster note-taking.

- 🔐 **Encrypted Notes**  
  Password-protected notes with custom encryption for **privacy** and **data protection**.

- 🧑‍💻 **Modern UI/UX**  
  Built with modular components, responsive layout, smooth transitions, and clean navigation.

---

## 🗂️ Project Structure

```bash
📁 components         # UI Components (Editor, NoteCard, Toolbar, etc.)
📁 utils              # Utility functions (AI, localStorage, Speech API)
📁 types              # TypeScript types and interfaces
📁 public             # Static assets
📄 .env               # Environment variables (excluded from Git)
📄 package.json       # Project metadata and dependencies
📄 vite.config.js     # Vite configuration
📄 index.html         # Main HTML entry point
```

---

## 🧪 How to Run Locally

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file** and add your Gemini API key
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Start the development server**
```bash
npm run dev
```

---

## ✅ Final Notes

- 💯 All core and bonus features fully implemented
- ⚙️ No use of external rich text editor libraries
- 📱 Fully responsive design tested across devices
- 🔐 AI key is secured using environment variables
- 🧠 Built with scalability and modularity in mind

---

> Thank you for the opportunity to showcase this solution. I hope you enjoy exploring NoteWise as much as I enjoyed building it!

---
