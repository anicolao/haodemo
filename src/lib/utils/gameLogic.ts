import type { Board, Player, GameStatus, WinCondition } from '../types/game.js';

/**
 * All possible winning combinations in tic-tac-toe
 */
const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6]
];

/**
 * Create an empty board
 */
export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

/**
 * Check if a move is valid (position is empty)
 */
export function isValidMove(board: Board, position: number): boolean {
  return position >= 0 && position < 9 && board[position] === null;
}

/**
 * Make a move on the board
 */
export function makeMove(board: Board, position: number, player: Player): Board {
  if (!isValidMove(board, position)) {
    throw new Error('Invalid move');
  }
  
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

/**
 * Get all empty positions on the board
 */
export function getEmptyPositions(board: Board): number[] {
  return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
}

/**
 * Check for a win condition
 */
export function checkWinner(board: Board): WinCondition | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        positions: combination,
        winner: board[a] as Player
      };
    }
  }
  return null;
}

/**
 * Check if the board is full (all positions occupied)
 */
export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

/**
 * Determine the current game status
 */
export function getGameStatus(board: Board): { status: GameStatus; winner: Player | null } {
  const winCondition = checkWinner(board);
  
  if (winCondition) {
    return { status: 'won', winner: winCondition.winner };
  }
  
  if (isBoardFull(board)) {
    return { status: 'draw', winner: null };
  }
  
  return { status: 'playing', winner: null };
}

/**
 * Get the opponent player
 */
export function getOpponent(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

/**
 * Check if a player can win with the next move
 */
export function canWinNextMove(board: Board, player: Player): number | null {
  const emptyPositions = getEmptyPositions(board);
  
  for (const position of emptyPositions) {
    const testBoard = makeMove(board, position, player);
    const winner = checkWinner(testBoard);
    if (winner && winner.winner === player) {
      return position;
    }
  }
  
  return null;
}