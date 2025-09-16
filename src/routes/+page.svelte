<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore.js';
	import type { Difficulty } from '$lib/types/game.js';

	// Subscribe to game state
	$: gameState = $gameStore;

	function handleCellClick(position: number) {
		gameStore.makePlayerMove(position);
	}

	function handleDifficultyChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		gameStore.setDifficulty(target.value as Difficulty);
	}

	function resetGame() {
		gameStore.resetGame();
	}

	function resetAll() {
		gameStore.resetAll();
	}

	// Helper to get cell display value
	function getCellDisplay(cell: string | null): string {
		return cell || '';
	}

	// Helper to get game status message
	function getStatusMessage(): string {
		if (gameState.gameStatus === 'won') {
			return gameState.winner === 'X' ? 'You Win!' : 'Computer Wins!';
		} else if (gameState.gameStatus === 'draw') {
			return "It's a Draw!";
		} else {
			return gameState.currentPlayer === 'X' ? 'Your Turn' : 'Computer Turn';
		}
	}
</script>

<svelte:head>
	<title>Tic-Tac-Toe AI Demo</title>
	<meta name="description" content="Play tic-tac-toe against an AI opponent" />
</svelte:head>

<main>
	<h1>Tic-Tac-Toe AI Demo</h1>
	
	<div class="game-status">
		<h2>{getStatusMessage()}</h2>
	</div>

	<div class="game-board">
		{#each gameState.board as cell, index}
			<button
				class="cell"
				class:occupied={cell !== null}
				class:winner={gameState.gameStatus === 'won' && gameState.winner}
				disabled={cell !== null || gameState.gameStatus !== 'playing' || gameState.currentPlayer !== 'X'}
				on:click={() => handleCellClick(index)}
			>
				{getCellDisplay(cell)}
			</button>
		{/each}
	</div>

	<div class="controls">
		<div class="difficulty-selector">
			<label for="difficulty">AI Difficulty:</label>
			<select
				id="difficulty"
				bind:value={gameState.difficulty}
				on:change={handleDifficultyChange}
			>
				<option value="easy">Easy</option>
				<option value="medium">Medium</option>
				<option value="hard">Hard</option>
			</select>
		</div>

		<div class="buttons">
			<button on:click={resetGame}>New Game</button>
			<button on:click={resetAll}>Reset Score</button>
		</div>
	</div>

	<div class="score">
		<h3>Score</h3>
		<div class="score-grid">
			<div>Player (X): {gameState.score.player}</div>
			<div>Computer (O): {gameState.score.computer}</div>
			<div>Draws: {gameState.score.draws}</div>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
		font-family: Arial, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
	}

	.game-status h2 {
		color: #555;
		margin-bottom: 1.5rem;
		min-height: 2rem;
	}

	.game-board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		max-width: 300px;
		margin: 0 auto 2rem;
		aspect-ratio: 1;
	}

	.cell {
		aspect-ratio: 1;
		border: 2px solid #333;
		background: #fff;
		font-size: 2rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #333;
	}

	.cell:hover:not(:disabled) {
		background: #f0f0f0;
		transform: scale(1.05);
	}

	.cell:disabled {
		cursor: not-allowed;
	}

	.cell.occupied {
		background: #e8f4fd;
	}

	.controls {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.difficulty-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.difficulty-selector label {
		font-weight: bold;
	}

	.difficulty-selector select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.buttons {
		display: flex;
		gap: 1rem;
	}

	.buttons button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		background: #007bff;
		color: white;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.buttons button:hover {
		background: #0056b3;
	}

	.score {
		margin-top: 2rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.score h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.score-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		font-weight: bold;
	}

	@media (max-width: 600px) {
		main {
			padding: 1rem;
		}

		.game-board {
			max-width: 250px;
		}

		.cell {
			font-size: 1.5rem;
		}

		.controls {
			flex-direction: column;
		}

		.buttons {
			flex-direction: column;
			width: 100%;
			max-width: 200px;
		}

		.score-grid {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
	}
</style>