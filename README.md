# Tic-Tac-Toe Demo Repository

This is a demonstration repository where our goal is to create an interactive tic-tac-toe game using SvelteKit. The application is a single-page application (SPA) that allows users to play tic-tac-toe against a computer opponent with multiple AI difficulty levels.

## Project Overview

This repository serves as a showcase for modern web development practices using SvelteKit to build a classic game with a clean, responsive interface and intelligent AI opponent.

## Features

✅ **Completed:**
- **AI Player Game Logic** - Fully implemented with three difficulty levels:
  - **Easy**: Random valid moves for beginners
  - **Medium**: Strategic play with win/block detection and center preference
  - **Hard**: Minimax algorithm for optimal play (unbeatable)
- **Game State Management** - Reactive store-based architecture
- **Core Game Engine** - Complete tic-tac-toe logic with win detection
- **Responsive UI** - Clean, accessible interface that works on all devices
- **Score Tracking** - Persistent score across multiple games

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/anicolao/haodemo.git
cd haodemo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

### Testing

```bash
# Run TypeScript checks
npm run check

# Run simple functionality tests
node tests/simple-test.js
```

## Architecture

The project follows the architecture outlined in [DESIGN.md](./DESIGN.md):

```
src/
├── lib/
│   ├── types/game.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── gameLogic.ts       # Core game engine
│   │   └── aiPlayer.ts        # AI player implementation
│   └── stores/gameStore.ts    # Svelte store for state management
├── routes/
│   └── +page.svelte          # Main game interface
└── app.html                  # HTML template
```

## AI Implementation Details

The AI player (`aiPlayer.ts`) implements three sophisticated difficulty levels:

### Easy Mode
- Makes random valid moves
- Perfect for beginners learning the game

### Medium Mode  
- Implements basic strategic thinking:
  1. Takes winning moves when available
  2. Blocks opponent winning moves
  3. Prefers center position
  4. Falls back to corners, then edges

### Hard Mode
- Uses the minimax algorithm for optimal play
- Analyzes all possible game states to choose the best move
- Provides an unbeatable opponent for experienced players

## Design Documentation

For detailed information about the application architecture, component structure, and implementation plan, please see:

**📋 [DESIGN.md](./DESIGN.md)** - Comprehensive design document outlining the SvelteKit-based tic-tac-toe application structure.

## Technology Stack

- **Framework**: SvelteKit
- **Language**: TypeScript for type safety
- **Styling**: CSS with Svelte's scoped styling
- **Build Tool**: Vite (default with SvelteKit)
- **State Management**: Svelte stores

## Demo

![Tic-Tac-Toe AI Demo](https://github.com/user-attachments/assets/9bfa26c2-0ae9-415f-840e-603c81d03e9d)

*The working tic-tac-toe game with AI opponent selection and score tracking*
