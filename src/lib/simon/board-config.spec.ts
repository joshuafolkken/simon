import { describe, it, expect } from 'vitest';
import { BOARD_Y, BOARD_Z, BOARD_LABEL_Z } from './board-config.js';

describe('BOARD_LABEL_Z', () => {
	it('floats text in front of the board backing (0.05)', () => {
		expect(BOARD_LABEL_Z).toBe(0.05);
	});

	it('is positive (in front of board face)', () => {
		expect(BOARD_LABEL_Z).toBeGreaterThan(0);
	});
});

describe('BOARD_Y', () => {
	it('is defined', () => {
		expect(BOARD_Y).toBeDefined();
	});
});

describe('BOARD_Z', () => {
	it('is negative (behind origin)', () => {
		expect(BOARD_Z).toBeLessThan(0);
	});
});
