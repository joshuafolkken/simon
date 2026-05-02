import { it, expect } from 'vitest';
import { SCORE_TEXT_Z } from './score-display-config.js';

it('SCORE_TEXT_Z floats text in front of the score panel (0.05)', () => {
	expect(SCORE_TEXT_Z).toBe(0.05);
});

it('SCORE_TEXT_Z is positive (in front of panel face)', () => {
	expect(SCORE_TEXT_Z).toBeGreaterThan(0);
});
