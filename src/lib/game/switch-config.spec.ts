import { describe, it, expect } from 'vitest';
import {
	SWITCH_ICON_TYPES,
	SWITCH_Z,
	BORDER_POS,
	PANEL_SIZE,
	BORDER_THICKNESS,
	CORNER_ARM_CENTER,
	CORNER_POS,
	CORNER_ARM,
	CYBER_RING_TUBULAR,
	HIT_AREA_Z
} from './switch-config.js';

describe('SWITCH_ICON_TYPES', () => {
	it('includes cyber', () => {
		expect(SWITCH_ICON_TYPES).toContain('cyber');
	});

	it('includes fullscreen', () => {
		expect(SWITCH_ICON_TYPES).toContain('fullscreen');
	});

	it('has exactly two entries', () => {
		expect(SWITCH_ICON_TYPES).toHaveLength(2);
	});
});

describe('SWITCH_Z', () => {
	it('is negative (behind origin)', () => {
		expect(SWITCH_Z).toBeLessThan(0);
	});

	it('floats away from the back wall (greater than -5)', () => {
		expect(SWITCH_Z).toBeGreaterThan(-5);
	});

	it('is at 2x the score display wall distance (-4.30)', () => {
		// Back wall z=-5, score display z=-4.65 (SIMON_BOARD_Z=-4.8 + FLOAT_Z_OFFSET=0.15)
		// Wall distance=0.35, 2x=0.70 => SWITCH_Z = -5 + 0.70 = -4.30
		expect(SWITCH_Z).toBeCloseTo(-4.3);
	});
});

describe('BORDER_POS', () => {
	it('equals half panel size minus half border thickness', () => {
		expect(BORDER_POS).toBeCloseTo(PANEL_SIZE / 2 - BORDER_THICKNESS / 2);
	});
});

describe('CORNER_ARM_CENTER', () => {
	it('equals corner position minus half arm length', () => {
		expect(CORNER_ARM_CENTER).toBeCloseTo(CORNER_POS - CORNER_ARM / 2);
	});
});

describe('CYBER_RING_TUBULAR', () => {
	it('is 6 for hexagonal ring shape', () => {
		expect(CYBER_RING_TUBULAR).toBe(6);
	});
});

describe('HIT_AREA_Z', () => {
	it('is positive (in front of panel face)', () => {
		expect(HIT_AREA_Z).toBeGreaterThan(0);
	});
});
