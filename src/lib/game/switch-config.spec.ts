import { describe, it, expect } from 'vitest';
import {
	SWITCH_ICON_TYPES,
	SWITCH_Y,
	SWITCH_Z,
	BORDER_POS,
	PANEL_SIZE,
	PANEL_DEPTH,
	BORDER_THICKNESS,
	BORDER_DEPTH,
	CORNER_ARM_CENTER,
	CORNER_POS,
	CORNER_ARM,
	CYBER_RING_TUBULAR,
	HIT_AREA_Z,
	LABEL_FONT_SIZE,
	DEFAULT_SWITCH_GEOMETRY
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
		// Back wall z=-5, score display z=-4.65 (BOARD_Z=-4.8 + FLOAT_Z_OFFSET=0.15)
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

describe('DEFAULT_SWITCH_GEOMETRY', () => {
	it('switch_y matches SWITCH_Y constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.switch_y).toBe(SWITCH_Y);
	});

	it('switch_z matches SWITCH_Z constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.switch_z).toBe(SWITCH_Z);
	});

	it('panel_size matches PANEL_SIZE constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.panel_size).toBe(PANEL_SIZE);
	});

	it('panel_depth matches PANEL_DEPTH constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.panel_depth).toBe(PANEL_DEPTH);
	});

	it('border_thickness matches BORDER_THICKNESS constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.border_thickness).toBe(BORDER_THICKNESS);
	});

	it('border_depth matches BORDER_DEPTH constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.border_depth).toBe(BORDER_DEPTH);
	});

	it('label_font_size matches LABEL_FONT_SIZE constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.label_font_size).toBe(LABEL_FONT_SIZE);
	});

	it('hit_area_z matches HIT_AREA_Z constant', () => {
		expect(DEFAULT_SWITCH_GEOMETRY.hit_area_z).toBe(HIT_AREA_Z);
	});

	it('has all required fields (no undefined values)', () => {
		for (const [key, value] of Object.entries(DEFAULT_SWITCH_GEOMETRY)) {
			expect(value, `${key} should not be undefined`).not.toBeUndefined();
		}
	});
});
