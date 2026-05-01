import { describe, it, expect } from 'vitest';
import { fonts } from './fonts';

describe('fonts', () => {
	it('get_font returns retro font in normal mode', () => {
		expect(fonts.get_font(false)).toBe(fonts.FONT_RETRO);
	});

	it('get_font returns alt font in alt mode', () => {
		expect(fonts.get_font(true)).toBe(fonts.FONT_ALT);
	});

	it('retro and alt fonts are different URLs', () => {
		expect(fonts.FONT_RETRO).not.toBe(fonts.FONT_ALT);
	});

	it('font paths are self-hosted local paths', () => {
		expect(fonts.FONT_RETRO).toMatch(/^\/fonts\//);
		expect(fonts.FONT_ALT).toMatch(/^\/fonts\//);
	});

	it('get_font_size_multiplier returns retro multiplier in normal mode', () => {
		expect(fonts.get_font_size_multiplier(false)).toBe(fonts.RETRO_FONT_SIZE_MULTIPLIER);
	});

	it('get_font_size_multiplier returns alt multiplier in alt mode', () => {
		expect(fonts.get_font_size_multiplier(true)).toBe(fonts.ALT_FONT_SIZE_MULTIPLIER);
	});

	it('retro multiplier is 0.8', () => {
		expect(fonts.RETRO_FONT_SIZE_MULTIPLIER).toBe(0.8);
	});

	it('alt multiplier is 1', () => {
		expect(fonts.ALT_FONT_SIZE_MULTIPLIER).toBe(1);
	});

	it('get_font_family returns retro family in normal mode', () => {
		expect(fonts.get_font_family(false)).toBe(fonts.FONT_FAMILY_RETRO);
	});

	it('get_font_family returns alt family in alt mode', () => {
		expect(fonts.get_font_family(true)).toBe(fonts.FONT_FAMILY_ALT);
	});

	it('font families are distinct', () => {
		expect(fonts.FONT_FAMILY_RETRO).not.toBe(fonts.FONT_FAMILY_ALT);
	});
});
