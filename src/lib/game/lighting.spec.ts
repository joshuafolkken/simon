import { describe, it, expect } from 'vitest';
import { lighting } from './lighting';

describe('lighting', () => {
	it('alt ambient intensity is greater than normal ambient intensity', () => {
		expect(lighting.ALT_AMBIENT_INTENSITY).toBeGreaterThan(lighting.AMBIENT_INTENSITY);
	});

	it('alt point light intensity is greater than normal point light intensity', () => {
		expect(lighting.ALT_POINT_LIGHT_INTENSITY).toBeGreaterThan(lighting.POINT_LIGHT_INTENSITY);
	});

	it('get_ambient_intensity returns higher value in alt mode', () => {
		expect(lighting.get_ambient_intensity(true)).toBeGreaterThan(
			lighting.get_ambient_intensity(false)
		);
	});

	it('get_point_light_intensity returns higher value in alt mode', () => {
		expect(lighting.get_point_light_intensity(true)).toBeGreaterThan(
			lighting.get_point_light_intensity(false)
		);
	});

	it('get_ambient_color returns white in normal mode', () => {
		expect(lighting.get_ambient_color(false)).toBe(lighting.AMBIENT_COLOR_NORMAL);
	});

	it('get_ambient_color returns non-white color in alt mode', () => {
		expect(lighting.get_ambient_color(true)).toBe(lighting.AMBIENT_COLOR_ALT);
		expect(lighting.get_ambient_color(true)).not.toBe(lighting.AMBIENT_COLOR_NORMAL);
	});
});
