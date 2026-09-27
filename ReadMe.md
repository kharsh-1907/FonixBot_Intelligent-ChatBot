# 🤖 FonixBot – Intelligent AI Chatbot

FonixBot is a full-stack AI chatbot built with **React, Node.js, Express, MongoDB, and Google Gemini AI**.

## ✨ Features

- 🤖 AI-powered chat with Google Gemini
- 🔐 User Signup & Login
- 💬 Create and manage conversations
- 💾 Persistent chat history
- 🏷️ Chat title management
- 📝 Personal notes
- ✏️ Create, update and delete notes
- 🗄️ MongoDB database
- ⚡ React + Vite frontend

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- React Router
- Tailwind CSS
- Bootstrap

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Google Gemini API

## 📁 Project Structure

```text
FonixBot_Intelligent-ChatBot/
│
├── ai_App/       # React frontend
│
├── Backend/      # Node.js + Express backend
│
└── README.md


🚀 Setup
Backend
cd Backend
npm install

Create .env:

MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_Secret=your_jwt_secret

Run:

node index.js
Frontend
cd ai_App
npm install

Create .env:

VITE_GEMINI_API_KEY=your_gemini_api_key

Run:

npm run dev
🔐 Environment Variables

Do not upload .env files or real API keys to GitHub.

Use the provided .env.example files as templates.

🤖 Gemini AI

FonixBot uses Google Gemini AI to generate intelligent responses and power the chatbot experience.