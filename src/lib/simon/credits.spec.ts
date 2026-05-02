import { describe, it, expect } from 'vitest';
import { CREDITS_TEXT, CREDITS_SCROLL_START_Z, CREDITS_SCROLL_END_Z } from './credits';

describe('credits', () => {
	describe('CREDITS_TEXT', () => {
		it('is a non-empty string', () => {
			expect(typeof CREDITS_TEXT).toBe('string');
			expect(CREDITS_TEXT.length).toBeGreaterThan(0);
		});

		it('includes the author credit', () => {
			expect(CREDITS_TEXT).toContain('joshuafolkken');
		});

		it('includes the GitHub repository URL', () => {
			expect(CREDITS_TEXT).toContain('github.com/joshuafolkken/simon');
		});

		it('includes core framework credits', () => {
			expect(CREDITS_TEXT).toContain('Svelte');
			expect(CREDITS_TEXT).toContain('Three.js');
			expect(CREDITS_TEXT).toContain('Threlte');
			expect(CREDITS_TEXT).toContain('TypeScript');
		});

		it('includes @joshuafolkken/kit credit', () => {
			expect(CREDITS_TEXT).toContain('@joshuafolkken/kit');
		});

		it('includes deployment platform credit', () => {
			expect(CREDITS_TEXT).toContain('Cloudflare');
		});

		it('includes font credits', () => {
			expect(CREDITS_TEXT).toContain('Press Start 2P');
			expect(CREDITS_TEXT).toContain('Orbitron');
		});

		it('includes font author credits', () => {
			expect(CREDITS_TEXT).toContain('Boisclair');
			expect(CREDITS_TEXT).toContain('McInerney');
		});

		it('includes font license', () => {
			expect(CREDITS_TEXT).toContain('SIL Open Font License');
		});

		it('includes game concept attribution', () => {
			expect(CREDITS_TEXT).toContain('Ralph H. Baer');
			expect(CREDITS_TEXT).toContain('Howard J. Morrison');
			expect(CREDITS_TEXT).toContain('Milton Bradley');
		});

		it('includes open source library credits', () => {
			expect(CREDITS_TEXT).toContain('mrdoob/three.js');
			expect(CREDITS_TEXT).toContain('microsoft/playwright');
		});

		it('includes testing and tooling section', () => {
			expect(CREDITS_TEXT).toContain('Vitest');
			expect(CREDITS_TEXT).toContain('Playwright');
			expect(CREDITS_TEXT).toContain('ESLint');
		});

		it('includes AI tools credit', () => {
			expect(CREDITS_TEXT).toContain('Claude Code');
			expect(CREDITS_TEXT).toContain('Sonnet 4.6');
		});

		it('ends with thank you message', () => {
			expect(CREDITS_TEXT).toContain('THANK YOU FOR PLAYING');
		});

		it('includes DRAGON-STUDIO sound effect credit', () => {
			expect(CREDITS_TEXT).toContain('Sound Effect by');
			expect(CREDITS_TEXT).toContain('DRAGON-STUDIO');
			expect(CREDITS_TEXT).toContain('from Pixabay');
		});

		it('includes sponsors section', () => {
			expect(CREDITS_TEXT).toContain('SPONSORS');
			expect(CREDITS_TEXT).toContain('Incognito');
		});

		it('section headers remain in ALL CAPS', () => {
			expect(CREDITS_TEXT).toContain('SPONSORS');
			expect(CREDITS_TEXT).toContain('GAME CONCEPT');
			expect(CREDITS_TEXT).toContain('BUILT WITH');
			expect(CREDITS_TEXT).toContain('FONTS');
			expect(CREDITS_TEXT).toContain('TESTING & TOOLING');
			expect(CREDITS_TEXT).toContain('OPEN SOURCE LIBRARIES');
		});
	});

	describe('scroll bounds', () => {
		it('CREDITS_SCROLL_START_Z is positive', () => {
			expect(CREDITS_SCROLL_START_Z).toBeGreaterThan(0);
		});

		it('CREDITS_SCROLL_END_Z is negative', () => {
			expect(CREDITS_SCROLL_END_Z).toBeLessThan(0);
		});

		it('CREDITS_SCROLL_START_Z is greater than CREDITS_SCROLL_END_Z', () => {
			expect(CREDITS_SCROLL_START_Z).toBeGreaterThan(CREDITS_SCROLL_END_Z);
		});

		it('CREDITS_SCROLL_START_Z and CREDITS_SCROLL_END_Z are symmetric around zero', () => {
			expect(CREDITS_SCROLL_START_Z).toBeCloseTo(-CREDITS_SCROLL_END_Z);
		});
	});
});
