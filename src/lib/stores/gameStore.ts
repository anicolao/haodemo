import { writable } from 'svelte/store';
import type { GameState, Player, Difficulty } from '../types/game.js';
import {
  createEmptyBoard,
  makeMove,
  getGameStatus,
  isValidMove
} from '../utils/gameLogic.js';
import { createAIPlayer } from '../utils/aiPlayer.js';

/**
 * Initial game state
 */
const initialState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  gameStatus: 'playing',
  winner: null,
  score: {
    player: 0,
    computer: 0,
    draws: 0
  },
  difficulty: 'medium'
};

/**
 * Create the game store
 */
function createGameStore() {
  const { subscribe, set, update } = writable<GameState>(initialState);
  
  // AI player instance
  let aiPlayer = createAIPlayer('medium', 'O');

  return {
    subscribe,
    
    /**
     * Make a player move
     */
    makePlayerMove: (position: number) => {
      update(state => {
        // Only allow moves during playing state and when it's player's turn
        if (state.gameStatus !== 'playing' || state.currentPlayer !== 'X') {
          return state;
        }
        
        // Check if move is valid
        if (!isValidMove(state.board, position)) {
          return state;
        }
        
        // Make the move
        const newBoard = makeMove(state.board, position, 'X');
        const gameResult = getGameStatus(newBoard);
        
        const newState = {
          ...state,
          board: newBoard,
          currentPlayer: 'O' as Player,
          gameStatus: gameResult.status,
          winner: gameResult.winner
        };
        
        // Update score if game ended
        if (gameResult.status !== 'playing') {
          if (gameResult.winner === 'X') {
            newState.score.player++;
          } else if (gameResult.winner === 'O') {
            newState.score.computer++;
          } else {
            newState.score.draws++;
          }
        }
        
        return newState;
      });
      
      // Trigger AI move if game is still playing
      setTimeout(() => {
        gameStore.makeAIMove();
      }, 100);
    },
    
    /**
     * Make an AI move
     */
    makeAIMove: async () => {
      let currentState: GameState;
      const unsubscribe = subscribe(state => currentState = state);
      unsubscribe();
      
      // Only make AI move during playing state and when it's AI's turn
      if (currentState!.gameStatus !== 'playing' || currentState!.currentPlayer !== 'O') {
        return;
      }
      
      try {
        const aiMove = await aiPlayer.getBestMove(currentState!.board);
        
        update(state => {
          // Double-check state hasn't changed
          if (state.gameStatus !== 'playing' || state.currentPlayer !== 'O') {
            return state;
          }
          
          // Make AI move
          const newBoard = makeMove(state.board, aiMove, 'O');
          const gameResult = getGameStatus(newBoard);
          
          const newState = {
            ...state,
            board: newBoard,
            currentPlayer: 'X' as Player,
            gameStatus: gameResult.status,
            winner: gameResult.winner
          };
          
          // Update score if game ended
          if (gameResult.status !== 'playing') {
            if (gameResult.winner === 'X') {
              newState.score.player++;
            } else if (gameResult.winner === 'O') {
              newState.score.computer++;
            } else {
              newState.score.draws++;
            }
          }
          
          return newState;
        });
      } catch (error) {
        console.error('AI move failed:', error);
      }
    },
    
    /**
     * Reset the game board but keep score
     */
    resetGame: () => {
      update(state => ({
        ...state,
        board: createEmptyBoard(),
        currentPlayer: 'X',
        gameStatus: 'playing',
        winner: null
      }));
    },
    
    /**
     * Reset the entire game including score
     */
    resetAll: () => {
      set(initialState);
    },
    
    /**
     * Set difficulty level
     */
    setDifficulty: (difficulty: Difficulty) => {
      aiPlayer.setDifficulty(difficulty);
      update(state => ({
        ...state,
        difficulty
      }));
    }
  };
}

/**
 * Export the game store instance
 */
export const gameStore = createGameStore();