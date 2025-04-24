# Co-Write: Collaborative Story Writing App

A collaborative story-writing application developed by junior developers at Northcoders Bootcamp. This project represents our first major React Native application, built after 3 months of JavaScript learning and 3 weeks of dedicated development time.

## 🚀 Overview

Co-Write is a mobile application that enables users to collaboratively create stories. Users can start new stories, contribute to existing ones, and view completed stories with AI-generated images.

## ⚠️ Important Note

This is an MVP (Minimum Viable Product) showcase project, developed as part of our learning journey at Northcoders. While functional, it represents our first steps into mobile app development and React Native.

## 🛠️ Tech Stack

- React Native
- Firebase (Authentication, Firestore)
- TypeScript
- React Navigation
- OpenAI API (Text and Image Generation)
- OpenRouter API (Text Generation)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- React Native development environment set up
- iOS Simulator (for Mac) or Android Emulator

## 🔑 Required API Keys

To run this project, you'll need to set up the following:

1. Firebase Configuration
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration to `firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

2. OpenAI API
   - Create an account at [OpenAI](https://platform.openai.com)
   - Generate an API key
   - Add your API key to your environment variables:

   ```bash
   OPENAI_API_KEY=your-api-key
   ```

3. OpenRouter API
   - Create an account at [OpenRouter](https://openrouter.ai)
   - Generate an API key
   - Add your API key to your environment variables:

   ```bash
   OPENROUTER_API_KEY=your-api-key
   ```

## 🤖 AI Models Used

### Text Generation

Used for story continuation and creative writing
 and simpler text tasks and suggestions

- OpenRouter (openAI library)
  - Model: `meta-llama/llama-4-maverick:free`
- OpenAI
  - Model: `gpt-4o-mini`

### Image Generation

- OpenAI DALL-E 3
  - Used for generating story illustrations
  - Model: `dall-e-3`
  - Resolution: 1024x1024

## 🚀 Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd co-write
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

5. Run on iOS:

```bash
npm run ios
# or
yarn ios
```

6. Run on Android:

```bash
npm run android
# or
yarn android
```

## 🎯 Features

- User authentication
- Create new story threads
- Collaborative story writing
- AI-powered story continuation
- View completed stories with AI-generated images
- Real-time updates
- Word limit enforcement
- Voting system

## 📱 Screenshots

[Add screenshots of your app here]

## 🤝 Contributing

This is a showcase project from Northcoders Bootcamp. While we're not accepting external contributions at this time, we welcome feedback and suggestions!

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Northcoders Bootcamp Students
- Created as part of our final project showcase

## 🙏 Acknowledgments

- Northcoders Bootcamp for the learning opportunity
- React Native community for the excellent documentation
- Firebase for providing the backend infrastructure
- OpenAI for providing the AI models
- OpenRouter for providing access to various AI models
