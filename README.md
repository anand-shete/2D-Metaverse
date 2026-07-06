# 2D Metaverse

A real-time 2D virtual campus inspired by [Gather.town](https://gather.town) where students can move around, chat, collaborate, and interact inside a shared world.

## Architecture

- System Design diagram
- CI/CD diagram
- Agentic RAG diagram

## Live Demo

If you directly want to view this project, click this [Link](https://metaverse.anandshete.dev/)

## Features

- Multiplayer 2D campus built with Pixi.js
- Interactive rooms for whiteboards, music, games, and library use
- Animated player sprites created with LibreSprite
- Real-time world chat powered by Socket.IO
- Voice and video communication through PeerJS + WebRTC
- JWT-based authentication and socket validation
- ICE state handling for disconnect cleanup and connection management

## Metabot

Metabot is the in-world AI assistant for academic note retrieval.

- Users invoke it directly from world chat by including `metabot` in their query
- The system extracts structured metadata from uploaded notes instead of relying on a vector database
- Notes are uploaded to S3 and indexed in MongoDB after metadata extraction
- Retrieval uses Groq-powered intent detection, MongoDB filtering, and a final response synthesis step

## Deployment & Infrastructure

- Frontend deployment: Vercel
- Backend deployment: AWS EC2 behind Nginx as reverse proxy, with PM2 and GitHub Actions for Continious Deployment pipeline

## Tech Stack

- **Frontend**: React, Tailwind CSS, ShadCN UI, Pixi.js, LibreSprite, PeerJS, WebRTC
- **Backend**: Fastify, Socket.IO, JWT, AWS SDK, Groq SDK, Typegoose
- **Database**: MongoDB
- **DevOps & Cloud**: AWS EC2, AWS S3, AWS Lambda, Nginx, PM2, GitHub Actions, Vercel

## Local Development

### Prerequisites

- Node.js and npm
- MongoDB
- AWS credentials for S3 uploads
- Groq API key

### Backend setup

1. `cd backend`
2. Rename `.env.example` to `.env` and add your environment varibles
3. Install dependencies with `npm install`
4. Start development server with `npm run dev`
5. Verify output in terminal

```sh
MongoDB connected
Server started on http://localhost:3000
```

### Frontend setup

1. `cd frontend`
2. Rename `.env.example` to `.env`
3. Install dependencies with `npm install`
4. Start the frontend with `npm run dev`

### Run locally

- Make sure the backend origin matches the frontend URL in `FRONTEND_URI1` and `FRONTEND_URI2` in your `.env` file in backend
- Start the backend and frontend in separate terminals
- Open the Vite URL shown in the frontend terminal
