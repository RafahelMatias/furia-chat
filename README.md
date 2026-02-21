# FURIA Live Chat (Real-Time E-Sports Platform)

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Project Overview

A real-time live chat application developed as a **Coding Challenge** to simulate fan engagement during e-Sports broadcasts (specifically for FURIA's CS:GO matches). 

The core architectural focus was to establish a low-latency, persistent bidirectional connection between multiple clients and the server using **WebSockets**, deviating from traditional REST HTTP requests to allow instant broadcasting.

🔗 **Live Demo:** [furia-chat-musv.onrender.com](https://furia-chat-musv.onrender.com)

## 🚀 Key Features

* **Real-Time Bidirectional Comms:** Built with `Socket.IO`, allowing instant message delivery across all connected active clients without polling.
* **Live Score Broadcasting:** The backend runs independent node intervals to simulate live match updates, pushing score changes to the client autonomously.
* **Interactive Bot Commands:** * Type `/cheer` to broadcast a visual fan celebration to the entire room.
  * Type `/vote` to interact with the local bot to predict the match winner.
* **Auto-Scrolling UI:** Chat implements React `useRef` hooks to maintain scroll state at the bottom as new streams of data arrive.

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4.
* **Backend:** Next.js Custom API Routes acting as a Node.js server.
* **Networking:** `socket.io` and `socket.io-client`.
* **Language:** TypeScript.

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/RafahelMatias/furia-chat.git](https://github.com/RafahelMatias/furia-chat.git)
   cd furia-chat

2. **Install Dependencies:**
   ```Bash
   npm install

3. **Start the Development Server:**
   ```Bash
   npm run dev

The application will be available at http://localhost:3000.

Author: Rafahel Matias
Software Engineer focused on Full-Stack Development and Real-Time Systems.