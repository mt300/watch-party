# Watch Party 🎥🕺

A real-time collaborative watch party app that lets distributed users watch YouTube videos together, fully synchronized. Built using **Remix**, **Firebase Firestore**, and **TypeScript**, this project demonstrates key concepts such as real-time data syncing, state management across clients, and clean architectural patterns.

---

## 🧠 Features

- Create a session with a YouTube link
- Share a session link for others to join
- All users see the video in perfect sync:
  - Play/pause controls
  - Seeking to a specific time
  - Syncs even if users join late
- Real-time database updates with Firestore
- Robust edge-case handling for syncing and user interaction

---

## 🛠️ Technologies Used

- **Remix.run** – full stack React framework for modern web apps
- **Firebase (Firestore)** – real-time database for syncing video states
- **React Player** – flexible video player component for YouTube
- **TypeScript** – strict typing for better developer experience and maintainability
- **Vitest** – test runner for unit and integration testing (tests included, currently with Remix/Vitest integration pending fix)

---

## 🚀 Getting Started

To run the app locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/watch-party.git
cd watch-party
```
2. Install dependencies
```bash
npm install
```
3. Create Firebase project
Go to Firebase Console

Create a new project

Enable Firestore in test mode

Go to Project Settings > General > Your Apps

Click Add App > Web App and copy the Firebase config

4. Configure environment variables
Create a .env file at the root of the project with your Firebase config:

```.env
FIREBASE_CONFIG='{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID"
}'
```
Make sure the value is stringified JSON as shown above.

5. Run the app
```bash
npm run dev
```

Now visit http://localhost:8081/create to start a session.

🧪 Testing
Basic unit tests are included for:

Creating and joining a session

Play/pause syncing

Seeking behavior

Late joiner sync accuracy

To run tests (currently Remix + Vitest integration may need patching):

```bash
npm run test
```

