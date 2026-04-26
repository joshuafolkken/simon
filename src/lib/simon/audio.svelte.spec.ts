import { describe, it, expect } from 'vitest';
import { simon_audio } from '$lib/simon/audio';
import type { ButtonColor } from '$lib/simon/types';

const ALL_COLORS: ButtonColor[] = ['green', 'red', 'yellow', 'blue'];

describe('simon audio', () => {
	it.each(ALL_COLORS)('play_tone does not throw for %s', (color) => {
		expect(() => simon_audio.play_tone(color, 100)).not.toThrow();
	});
});
