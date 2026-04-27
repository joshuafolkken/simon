import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import GameScene from './GameScene.svelte';
import { game_state } from '$lib/game/state.svelte';

describe('GameScene', () => {
	afterEach(() => {
		if (game_state.is_cyber) game_state.toggle_cyber();
	});

	it('renders game-scene container', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('[data-testid="game-scene"]')).toBeTruthy();
	});

	it('renders a canvas element', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('canvas')).toBeTruthy();
	});

	it('does not render cyber-glow when not in cyber mode', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('[data-testid="cyber-glow"]')).toBeNull();
	});

	it('crosshair is not rendered when pointer is not locked', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('[data-testid="crosshair"]')).toBeNull();
	});

	it('renders cyber-glow overlay when cyber mode is active', () => {
		game_state.toggle_cyber();
		const { container } = render(GameScene);
		expect(container.querySelector('[data-testid="cyber-glow"]')).toBeTruthy();
	});
});
