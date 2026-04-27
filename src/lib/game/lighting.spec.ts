import { describe, it, expect } from 'vitest';
import { lighting } from './lighting';

describe('lighting', () => {
	it('cyber ambient intensity is greater than normal ambient intensity', () => {
		expect(lighting.CYBER_AMBIENT_INTENSITY).toBeGreaterThan(lighting.AMBIENT_INTENSITY);
	});

	it('cyber point light intensity is greater than normal point light intensity', () => {
		expect(lighting.CYBER_POINT_LIGHT_INTENSITY).toBeGreaterThan(lighting.POINT_LIGHT_INTENSITY);
	});

	it('get_ambient_intensity returns higher value in cyber mode', () => {
		expect(lighting.get_ambient_intensity(true)).toBeGreaterThan(
			lighting.get_ambient_intensity(false)
		);
	});

	it('get_point_light_intensity returns higher value in cyber mode', () => {
		expect(lighting.get_point_light_intensity(true)).toBeGreaterThan(
			lighting.get_point_light_intensity(false)
		);
	});
});
