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

	it('starts with cyber mode off', () => {
		expect(game_state.is_cyber).toBe(false);
	});

	it('toggles cyber mode on', () => {
		game_state.toggle_cyber();
		expect(game_state.is_cyber).toBe(true);
	});

	it('toggles cyber mode off again', () => {
		game_state.toggle_cyber();
		game_state.toggle_cyber();
		expect(game_state.is_cyber).toBe(false);
	});

	it('resets cyber mode on return_to_title', () => {
		game_state.toggle_cyber();
		game_state.return_to_title();
		expect(game_state.is_cyber).toBe(false);
	});
});
