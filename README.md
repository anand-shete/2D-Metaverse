# 2D Metaverse

2D Metaverse is a virtual environment for students to interact via audio and video, share notes,

## Product Requirements

- Your system should treat media as optional capability.
- Treat `socket.id` as primary identity of a player instead of `peerId` (optional media channel).

## Feature Implementation

- Remove Joystick and replace it with arrow keys on mobile view.
- For every new participant in audio/video, Existing users must create a new peer connection and Exchange offer/answer again
- Treat `w` and `W` as same for player movement.
