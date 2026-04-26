import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import GameScene from './GameScene.svelte';

describe('GameScene', () => {
	it('renders game-scene container', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('[data-testid="game-scene"]')).toBeTruthy();
	});

	it('renders a canvas element', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('canvas')).toBeTruthy();
	});
});
