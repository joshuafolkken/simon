import { describe, it, expect } from 'vitest';
import { advance_scroll } from './credits-scroll';
import {
	CREDITS_SCROLL_START_Z,
	CREDITS_SCROLL_END_Z,
	CREDITS_SCROLL_SPEED
} from './credits-config';

const FRAME_DELTA = 0.016;

describe('advance_scroll', () => {
	it('moves z in the negative direction by speed times delta', () => {
		const initial_z = 5;
		const result = advance_scroll(initial_z, FRAME_DELTA);
		expect(result).toBeCloseTo(initial_z - CREDITS_SCROLL_SPEED * FRAME_DELTA);
	});

	it('resets to CREDITS_SCROLL_START_Z when z drops below CREDITS_SCROLL_END_Z', () => {
		const past_end = CREDITS_SCROLL_END_Z - 0.1;
		expect(advance_scroll(past_end, 0)).toBe(CREDITS_SCROLL_START_Z);
	});

	it('does not reset when z equals CREDITS_SCROLL_END_Z exactly', () => {
		expect(advance_scroll(CREDITS_SCROLL_END_Z, 0)).toBe(CREDITS_SCROLL_END_Z);
	});

	it('continues scrolling when z is above CREDITS_SCROLL_END_Z', () => {
		const z = 0;
		const result = advance_scroll(z, 1);
		expect(result).toBeLessThan(z);
		expect(result).not.toBe(CREDITS_SCROLL_START_Z);
	});

	it('CREDITS_SCROLL_START_Z is greater than CREDITS_SCROLL_END_Z', () => {
		expect(CREDITS_SCROLL_START_Z).toBeGreaterThan(CREDITS_SCROLL_END_Z);
	});

	it('CREDITS_SCROLL_SPEED is a positive number', () => {
		expect(CREDITS_SCROLL_SPEED).toBeGreaterThan(0);
	});
});
