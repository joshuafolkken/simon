import { describe, it, expect } from 'vitest';
import { inject_version } from './hooks.server';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(
	readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
) as { version: string };

describe('inject_version', () => {
	it('replaces the placeholder with the package version', () => {
		const html = '<p class="game-version">v__APP_VERSION__</p>';
		expect(inject_version(html)).toBe(`<p class="game-version">v${version}</p>`);
	});

	it('replaces all occurrences of the placeholder', () => {
		const html = '__APP_VERSION__ and __APP_VERSION__';
		expect(inject_version(html)).toBe(`${version} and ${version}`);
	});

	it('passes through html that has no placeholder', () => {
		const html = '<p>no placeholder here</p>';
		expect(inject_version(html)).toBe(html);
	});
});
