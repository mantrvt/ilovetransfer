# iLoveTransfer

iLoveTransfer is a lightweight, instant file-sharing web application that allows users to quickly transfer files between devices. It leverages WebSockets to enable fast, seamless sharing within custom rooms.

**Live App:** [https://ilovetransfer.onrender.com/](https://ilovetransfer.onrender.com/)

![iLoveTransfer Logo](public/assets/ilt.png)

## Features

* **Instant Transfer:** Utilizes WebSockets for real-time file transmission without the need for a traditional database or persistent file storage.
* **Room-Based Sharing:** Users can join specific "rooms" (e.g., `office123`) to securely share files only with others connected to the same room.
* **Multiple File Support:** Select and send multiple files at once. The system automatically queues and transmits them sequentially.
* **No Login Required:** Simple and fast—just enter a room name, connect, and start sharing immediately.
* **Real-time Progress:** Visual progress bars track both the uploading and downloading phases of the transfer.

## How It Works

1. **Connect:** Visit the site to establish a WebSocket connection with the server.
2. **Join a Room:** Enter a unique room name and click "Join Room". Anyone else who joins the same room name can exchange files with you.
3. **Select Files:** Click the file selection box to choose one or more files to send.
4. **Transfer:** The application chunks the files and streams them over the WebSocket connection. The receiving client reassembles the chunks and automatically prompts a download once complete.

## Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript, CSS3
* **Backend:** Node.js
* **Communication:** `ws` (WebSocket Library)

## Local Development

To run this project locally:

1. Clone the repository.
2. Ensure you have Node.js installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:8080`.
