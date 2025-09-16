import type { Board, Player, Difficulty } from '../types/game.js';
import {
  getEmptyPositions,
  makeMove,
  checkWinner,
  isBoardFull,
  canWinNextMove,
  getOpponent
} from './gameLogic.js';

/**
 * AI Player implementation with multiple difficulty levels
 */
export class AIPlayer {
  private difficulty: Difficulty;
  private player: Player;

  constructor(difficulty: Difficulty = 'medium', player: Player = 'O') {
    this.difficulty = difficulty;
    this.player = player;
  }

  /**
   * Get the best move for the current difficulty level
   */
  async getBestMove(board: Board): Promise<number> {
    // Add slight delay for better UX
    await this.delay(300);

    switch (this.difficulty) {
      case 'easy':
        return this.getRandomMove(board);
      case 'medium':
        return this.getMediumMove(board);
      case 'hard':
        return this.getMinimaxMove(board);
      default:
        return this.getMediumMove(board);
    }
  }

  /**
   * Easy difficulty: Random valid moves
   */
  private getRandomMove(board: Board): number {
    const emptyPositions = getEmptyPositions(board);
    if (emptyPositions.length === 0) {
      throw new Error('No valid moves available');
    }
    
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    return emptyPositions[randomIndex];
  }

  /**
   * Medium difficulty: Basic strategy
   * 1. Win if possible
   * 2. Block player from winning
   * 3. Take center if available
   * 4. Take corner if available
   * 5. Take any edge
   */
  private getMediumMove(board: Board): number {
    const opponent = getOpponent(this.player);
    
    // 1. Try to win
    const winMove = canWinNextMove(board, this.player);
    if (winMove !== null) {
      return winMove;
    }
    
    // 2. Block opponent from winning
    const blockMove = canWinNextMove(board, opponent);
    if (blockMove !== null) {
      return blockMove;
    }
    
    // 3. Take center if available
    if (board[4] === null) {
      return 4;
    }
    
    // 4. Take corners if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(pos => board[pos] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // 5. Take any edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(pos => board[pos] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }
    
    // Fallback to random move
    return this.getRandomMove(board);
  }

  /**
   * Hard difficulty: Minimax algorithm for optimal play
   */
  private getMinimaxMove(board: Board): number {
    const result = this.minimax(board, this.player, true);
    return result.position;
  }

  /**
   * Minimax algorithm implementation
   */
  private minimax(board: Board, player: Player, isMaximizing: boolean): { score: number; position: number } {
    const winner = checkWinner(board);
    
    // Terminal states
    if (winner) {
      if (winner.winner === this.player) {
        return { score: 10, position: -1 };
      } else {
        return { score: -10, position: -1 };
      }
    }
    
    if (isBoardFull(board)) {
      return { score: 0, position: -1 };
    }
    
    const emptyPositions = getEmptyPositions(board);
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestPosition = emptyPositions[0];
    
    for (const position of emptyPositions) {
      const newBoard = makeMove(board, position, player);
      const opponent = getOpponent(player);
      const result = this.minimax(newBoard, opponent, !isMaximizing);
      
      if (isMaximizing) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestPosition = position;
        }
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestPosition = position;
        }
      }
    }
    
    return { score: bestScore, position: bestPosition };
  }

  /**
   * Add delay for better UX
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set difficulty level
   */
  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  /**
   * Get current difficulty level
   */
  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  /**
   * Set player symbol
   */
  setPlayer(player: Player): void {
    this.player = player;
  }

  /**
   * Get player symbol
   */
  getPlayer(): Player {
    return this.player;
  }
}

/**
 * Create a new AI player instance
 */
export function createAIPlayer(difficulty: Difficulty = 'medium', player: Player = 'O'): AIPlayer {
  return new AIPlayer(difficulty, player);
}