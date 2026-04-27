import { describe, it, expect, beforeEach } from 'vitest';
import { game_state } from './state.svelte';

describe('game_state', () => {
	beforeEach(() => {
		game_state.return_to_title();
	});

	it('starts with cyber mode on', () => {
		expect(game_state.is_cyber).toBe(true);
	});

	it('toggles cyber mode off', () => {
		game_state.toggle_cyber();
		expect(game_state.is_cyber).toBe(false);
	});

	it('toggles cyber mode on again', () => {
		game_state.toggle_cyber();
		game_state.toggle_cyber();
		expect(game_state.is_cyber).toBe(true);
	});

	it('resets cyber mode to default (on) on return_to_title', () => {
		game_state.toggle_cyber();
		game_state.return_to_title();
		expect(game_state.is_cyber).toBe(true);
	});
});
