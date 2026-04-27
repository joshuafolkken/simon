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

	it('font paths are self-hosted local paths', () => {
		expect(fonts.FONT_RETRO).toMatch(/^\/fonts\//);
		expect(fonts.FONT_CYBER).toMatch(/^\/fonts\//);
	});

	it('get_font_size_multiplier returns retro multiplier in normal mode', () => {
		expect(fonts.get_font_size_multiplier(false)).toBe(fonts.RETRO_FONT_SIZE_MULTIPLIER);
	});

	it('get_font_size_multiplier returns cyber multiplier in cyber mode', () => {
		expect(fonts.get_font_size_multiplier(true)).toBe(fonts.CYBER_FONT_SIZE_MULTIPLIER);
	});

	it('retro multiplier is 0.8', () => {
		expect(fonts.RETRO_FONT_SIZE_MULTIPLIER).toBe(0.8);
	});

	it('cyber multiplier is 1', () => {
		expect(fonts.CYBER_FONT_SIZE_MULTIPLIER).toBe(1);
	});

	it('get_font_family returns retro family in normal mode', () => {
		expect(fonts.get_font_family(false)).toBe(fonts.FONT_FAMILY_RETRO);
	});

	it('get_font_family returns cyber family in cyber mode', () => {
		expect(fonts.get_font_family(true)).toBe(fonts.FONT_FAMILY_CYBER);
	});

	it('font families are distinct', () => {
		expect(fonts.FONT_FAMILY_RETRO).not.toBe(fonts.FONT_FAMILY_CYBER);
	});
});
