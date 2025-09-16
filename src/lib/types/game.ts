export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type GameStatus = 'playing' | 'won' | 'draw';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  score: {
    player: number;
    computer: number;
    draws: number;
  };
  difficulty: Difficulty;
}

export interface GameMove {
  position: number;
  player: Player;
}

export interface WinCondition {
  positions: number[];
  winner: Player;
}