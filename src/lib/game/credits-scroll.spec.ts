import { describe, it, expect } from 'vitest';
import { advance_scroll } from './credits-scroll';
import { CREDITS_SCROLL_SPEED } from './credits-config';

const FRAME_DELTA = 0.016;
const START_Z = 10;
const END_Z = -10;

describe('advance_scroll', () => {
	it('moves z in the negative direction by speed times delta', () => {
		const initial_z = 5;
		const result = advance_scroll(initial_z, FRAME_DELTA, START_Z, END_Z);
		expect(result).toBeCloseTo(initial_z - CREDITS_SCROLL_SPEED * FRAME_DELTA);
	});

	it('resets to start_z when z drops below end_z', () => {
		const past_end = END_Z - 0.1;
		expect(advance_scroll(past_end, 0, START_Z, END_Z)).toBe(START_Z);
	});

	it('does not reset when z equals end_z exactly', () => {
		expect(advance_scroll(END_Z, 0, START_Z, END_Z)).toBe(END_Z);
	});

	it('continues scrolling when z is above end_z', () => {
		const z = 0;
		const result = advance_scroll(z, 1, START_Z, END_Z);
		expect(result).toBeLessThan(z);
		expect(result).not.toBe(START_Z);
	});
});
