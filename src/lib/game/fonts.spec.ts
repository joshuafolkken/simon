import { describe, it, expect } from 'vitest';
import { fonts } from './fonts';

describe('fonts', () => {
	it('get_font returns retro font in normal mode', () => {
		expect(fonts.get_font(false)).toBe(fonts.FONT_RETRO);
	});

	it('get_font returns cyber font in cyber mode', () => {
		expect(fonts.get_font(true)).toBe(fonts.FONT_CYBER);
	});

	it('retro and cyber fonts are different URLs', () => {
		expect(fonts.FONT_RETRO).not.toBe(fonts.FONT_CYBER);
	});
});
