import { AIPlayer } from '../src/lib/utils/aiPlayer.ts';
import { createEmptyBoard, makeMove } from '../src/lib/utils/gameLogic.ts';

/**
 * Simple test runner for Node.js environment
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running AI Player Tests\n');
    
    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
        this.failed++;
      }
    }
    
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    
    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

const runner = new TestRunner();

// Helper function for assertions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test AI Player creation
runner.test('AI Player can be created with default settings', () => {
  const ai = new AIPlayer();
  assert(ai.getDifficulty() === 'medium', 'Default difficulty should be medium');
  assert(ai.getPlayer() === 'O', 'Default player should be O');
});

// Test AI Player settings
runner.test('AI Player settings can be changed', () => {
  const ai = new AIPlayer();
  ai.setDifficulty('hard');
  ai.setPlayer('X');
  
  assert(ai.getDifficulty() === 'hard', 'Difficulty should be changed to hard');
  assert(ai.getPlayer() === 'X', 'Player should be changed to X');
});

// Test Easy AI makes valid moves
runner.test('Easy AI makes valid moves', async () => {
  const ai = new AIPlayer('easy', 'O');
  const board = createEmptyBoard();
  
  const move = await ai.getBestMove(board);
  
  assert(move >= 0 && move <= 8, 'Move should be within valid range');
  assert(board[move] === null, 'Move should be on empty cell');
});

// Test AI blocks winning moves
runner.test('Medium AI blocks opponent winning moves', async () => {
  const ai = new AIPlayer('medium', 'O');
  
  // Create board where X can win on position 2
  let board = createEmptyBoard();
  board = makeMove(board, 0, 'X'); // X
  board = makeMove(board, 1, 'X'); // X
  // Position 2 would complete the win for X
  
  const move = await ai.getBestMove(board);
  
  assert(move === 2, 'AI should block the winning move at position 2');
});

// Test AI takes winning moves
runner.test('Medium AI takes winning moves when available', async () => {
  const ai = new AIPlayer('medium', 'O');
  
  // Create board where O can win on position 2
  let board = createEmptyBoard();
  board = makeMove(board, 0, 'O'); // O
  board = makeMove(board, 1, 'O'); // O
  board = makeMove(board, 3, 'X'); // X (random move)
  // Position 2 would complete the win for O
  
  const move = await ai.getBestMove(board);
  
  assert(move === 2, 'AI should take the winning move at position 2');
});

// Test Hard AI never loses
runner.test('Hard AI makes optimal moves', async () => {
  const ai = new AIPlayer('hard', 'O');
  
  // Test that AI prefers center on empty board
  const emptyBoard = createEmptyBoard();
  const move = await ai.getBestMove(emptyBoard);
  
  // On an empty board, the optimal move is usually center (4) or corner
  const optimalMoves = [0, 2, 4, 6, 8]; // center or corners
  assert(optimalMoves.includes(move), 'AI should choose center or corner on empty board');
});

// Test AI handles nearly full board
runner.test('AI handles nearly full board correctly', async () => {
  const ai = new AIPlayer('medium', 'O');
  
  // Create nearly full board with only one empty position
  let board = createEmptyBoard();
  board = makeMove(board, 0, 'X');
  board = makeMove(board, 1, 'O');
  board = makeMove(board, 2, 'X');
  board = makeMove(board, 3, 'O');
  board = makeMove(board, 4, 'X');
  board = makeMove(board, 5, 'O');
  board = makeMove(board, 6, 'X');
  board = makeMove(board, 7, 'O');
  // Position 8 is the only empty spot
  
  const move = await ai.getBestMove(board);
  
  assert(move === 8, 'AI should choose the only available position');
});

// Run all tests
runner.run().catch(console.error);