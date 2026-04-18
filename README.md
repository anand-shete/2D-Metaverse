# 2D Metaverse

2D Metaverse and virtual environment for students to interact via audio, voice and chat, share and retrieve notes using Agentic AI.

## Product Requirements

- Your system should treat media as optional capability.
- Treat `socket.id` as primary identity of a player instead of `peerId` (optional media channel).

## Feature Implementation

- [x] Remove Joystick and replace it with arrow keys on mobile view.

- [x] For every new participant in audio/video, Existing users must create a new peer connection and Exchange offer/answer again

- [x] Treat `w` and `W` as same for player movement.

- [x] Fix audioStream not transmitting accross devices

- [ ] Add RAG chain to retreive notes from S3 buckets.

- [x] Add authentication to `/metaverse` page.

- [x] To implement zoom button, zoom only the pixi layer keeping the UI layer same.

- [x] Use a Socket.io middleware to verify the JWT before allowing a connection to the /metaverse namespace.

## RAG chain workflow

**S3 Upload**: User drops a PDF into your bucket.

**Trigger (The Dev Part)**: An S3 Trigger kicks off an AWS Lambda (or a worker node).

**Metadata Extraction**: The worker sends the text to Gemini to say `Summarize this and give me the 'Subject' and 'Document Type'`

**Vectorization**: The worker then chunks the text and gets Embeddings.

**Database Storage**: You store everything in your Vector DB (like Pinecone or MongoDB Atlas).

```
Record: [Vector_Data] + Metadata: { subject: "OS", type: "Notes" }.
```
