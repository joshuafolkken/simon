import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TitleScene from './TitleScene.svelte';

describe('TitleScene', () => {
	it('renders a canvas element', () => {
		const { container } = render(TitleScene);
		expect(container.querySelector('canvas')).toBeTruthy();
	});

	it('renders the title container', () => {
		const { container } = render(TitleScene);
		expect(container.querySelector('.title-container')).toBeTruthy();
	});
});
