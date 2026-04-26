import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { simon_audio } from '$lib/simon/audio';
import { game_state } from '$lib/game/state.svelte';
import type { ButtonColor } from '$lib/simon/types';

const ALL_COLORS: ButtonColor[] = ['green', 'red', 'yellow', 'blue'];

describe('simon audio', () => {
	it.each(ALL_COLORS)('play_tone does not throw for %s', (color) => {
		expect(() => simon_audio.play_tone(color, 100)).not.toThrow();
	});
});

describe('simon audio cyber mode', () => {
	beforeEach(() => {
		game_state.toggle_cyber();
	});

	afterEach(() => {
		game_state.return_to_title();
	});

	it.each(ALL_COLORS)('play_tone does not throw for %s in cyber mode', (color) => {
		expect(() => simon_audio.play_tone(color, 100)).not.toThrow();
	});
});
