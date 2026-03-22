# 2D Metaverse

2D Metaverse is a virtual environment for students to interact via audio and video, share notes,

## Product Requirements

- Your system should treat media as optional capability.
- Treat `socket.id` as primary identity of a player instead of `peerId` (optional media channel).

## Feature Implementation

- [x] Remove Joystick and replace it with arrow keys on mobile view.

- [x] For every new participant in audio/video, Existing users must create a new peer connection and Exchange offer/answer again

- [x] Treat `w` and `W` as same for player movement.

- [ ] Fix audioStream not transmitting accross devices

- [ ] Add RAG chain to retreive notes from S3 buckets.

- [ ] One room has upload notes functionality, another one has notes retreival

- [ ] Add proper authentication to `/metaverse` page.

- [ ] To implement zoom button, zoom only the pixi layer keeping the UI layer same.