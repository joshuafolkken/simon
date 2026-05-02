import { describe, it, expect, beforeEach } from 'vitest';
import { game_state } from './state.svelte';

describe('game_state', () => {
	beforeEach(() => {
		game_state.return_to_title();
	});

	it('starts with alt mode on', () => {
		expect(game_state.is_alt).toBe(true);
	});

	it('toggles alt mode off', () => {
		game_state.toggle_alt();
		expect(game_state.is_alt).toBe(false);
	});

	it('toggles alt mode on again', () => {
		game_state.toggle_alt();
		game_state.toggle_alt();
		expect(game_state.is_alt).toBe(true);
	});

	it('resets alt mode to default (on) on return_to_title', () => {
		game_state.toggle_alt();
		game_state.return_to_title();
		expect(game_state.is_alt).toBe(true);
	});
});
