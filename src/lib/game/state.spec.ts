import { describe, it, expect, beforeEach } from 'vitest';
import { game_state } from './state.svelte';

describe('game_state', () => {
	beforeEach(() => {
		game_state.return_to_title();
	});

	it('starts in title scene', () => {
		expect(game_state.current_scene).toBe('title');
	});

	it('transitions to playing on start_game', () => {
		game_state.start_game();
		expect(game_state.current_scene).toBe('playing');
	});

	it('returns to title on return_to_title', () => {
		game_state.start_game();
		game_state.return_to_title();
		expect(game_state.current_scene).toBe('title');
	});
});
