import { describe, it, expect } from 'vitest';
import {
	CREDITS_FONT_SIZE,
	CREDITS_LINE_HEIGHT,
	CREDITS_NORMAL_COLOR,
	CREDITS_CYBER_COLOR,
	CREDITS_POSITION_Y,
	CREDITS_SCROLL_SPEED,
	CREDITS_GLOW_BLUR,
	CREDITS_GLOW_OPACITY,
	FLOOR_TEXT_ROTATION_X,
	make_credits_scroll_bounds
} from './credits-config';

describe('credits-config', () => {
	it('FLOOR_TEXT_ROTATION_X is -PI/2', () => {
		expect(FLOOR_TEXT_ROTATION_X).toBeCloseTo(-Math.PI / 2);
	});

	it('CREDITS_POSITION_Y is a small positive value above the floor', () => {
		expect(CREDITS_POSITION_Y).toBeGreaterThan(0);
		expect(CREDITS_POSITION_Y).toBeLessThan(0.1);
	});

	it('CREDITS_FONT_SIZE is a positive number', () => {
		expect(CREDITS_FONT_SIZE).toBeGreaterThan(0);
	});

	it('CREDITS_LINE_HEIGHT is greater than 1', () => {
		expect(CREDITS_LINE_HEIGHT).toBeGreaterThan(1);
	});

	it('CREDITS_NORMAL_COLOR is a valid hex color', () => {
		expect(CREDITS_NORMAL_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
	});

	it('CREDITS_CYBER_COLOR is a valid hex color', () => {
		expect(CREDITS_CYBER_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
	});

	it('CREDITS_NORMAL_COLOR and CREDITS_CYBER_COLOR are distinct', () => {
		expect(CREDITS_NORMAL_COLOR).not.toBe(CREDITS_CYBER_COLOR);
	});

	it('CREDITS_SCROLL_SPEED is a positive number', () => {
		expect(CREDITS_SCROLL_SPEED).toBeGreaterThan(0);
	});

	it('CREDITS_GLOW_BLUR is a non-empty string', () => {
		expect(typeof CREDITS_GLOW_BLUR).toBe('string');
		expect(CREDITS_GLOW_BLUR.length).toBeGreaterThan(0);
	});

	it('CREDITS_GLOW_OPACITY is between 0 and 1', () => {
		expect(CREDITS_GLOW_OPACITY).toBeGreaterThan(0);
		expect(CREDITS_GLOW_OPACITY).toBeLessThanOrEqual(1);
	});

	describe('make_credits_scroll_bounds', () => {
		it('start_z is positive', () => {
			const { start_z } = make_credits_scroll_bounds(10);
			expect(start_z).toBeGreaterThan(0);
		});

		it('end_z is negative', () => {
			const { end_z } = make_credits_scroll_bounds(10);
			expect(end_z).toBeLessThan(0);
		});

		it('start_z and end_z are symmetric around zero', () => {
			const { start_z, end_z } = make_credits_scroll_bounds(10);
			expect(start_z).toBeCloseTo(-end_z);
		});

		it('start_z increases as line_count increases', () => {
			const small = make_credits_scroll_bounds(10);
			const large = make_credits_scroll_bounds(100);
			expect(large.start_z).toBeGreaterThan(small.start_z);
		});
	});
});
