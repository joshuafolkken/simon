import { describe, it, expect, afterEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import GameScene from './GameScene.svelte';
import { game_state } from '$lib/game/state.svelte';
import { audio } from '$lib/game/audio';
import { device } from '$lib/game/device';
import { fullscreen } from '$lib/game/fullscreen.svelte';
import { session } from '$lib/game/session.svelte';

describe('GameScene', () => {
	afterEach(() => {
		if (game_state.is_cyber) game_state.toggle_cyber();
		session.reset_session();
		vi.restoreAllMocks();
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

	it('shows the click-to-play hint before the user clicks', () => {
		const { container } = render(GameScene);
		expect(container.querySelector('.click-hint')).toBeTruthy();
	});

	it('renders cyber-glow overlay when cyber mode is active', () => {
		game_state.toggle_cyber();
		const { container } = render(GameScene);
		expect(container.querySelector('[data-testid="cyber-glow"]')).toBeTruthy();
	});

	it('start_session runs init_audio only once across multiple clicks', () => {
		const spy = vi.spyOn(audio, 'init_audio');
		const { container } = render(GameScene);
		const scene = container.querySelector<HTMLElement>('[data-testid="game-scene"]');
		expect(scene).toBeTruthy();
		if (!scene) return;
		scene.click();
		scene.click();
		scene.click();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('start_session requests fullscreen on touch-primary devices', () => {
		vi.spyOn(device, 'is_touch_primary').mockReturnValue(true);
		const fullscreen_spy = vi.spyOn(fullscreen, 'request').mockResolvedValue();
		const { container } = render(GameScene);
		const scene = container.querySelector<HTMLElement>('[data-testid="game-scene"]');
		expect(scene).toBeTruthy();
		if (!scene) return;
		scene.click();
		expect(fullscreen_spy).toHaveBeenCalledTimes(1);
	});

	it('clicking the scene flips session.is_session_started to true', () => {
		expect(session.is_session_started).toBe(false);
		const { container } = render(GameScene);
		const scene = container.querySelector<HTMLElement>('[data-testid="game-scene"]');
		expect(scene).toBeTruthy();
		if (!scene) return;
		scene.click();
		expect(session.is_session_started).toBe(true);
	});

	it('hides the click-hint after the session starts', () => {
		const { container } = render(GameScene);
		const scene = container.querySelector<HTMLElement>('[data-testid="game-scene"]');
		expect(scene).toBeTruthy();
		if (!scene) return;
		expect(container.querySelector('.click-hint')).toBeTruthy();
		scene.click();
		flushSync();
		expect(container.querySelector('.click-hint')).toBeNull();
	});

	it('start_session does not request fullscreen on desktop devices but still inits audio', () => {
		vi.spyOn(device, 'is_touch_primary').mockReturnValue(false);
		const fullscreen_spy = vi.spyOn(fullscreen, 'request').mockResolvedValue();
		const audio_spy = vi.spyOn(audio, 'init_audio');
		const { container } = render(GameScene);
		const scene = container.querySelector<HTMLElement>('[data-testid="game-scene"]');
		expect(scene).toBeTruthy();
		if (!scene) return;
		scene.click();
		expect(fullscreen_spy).not.toHaveBeenCalled();
		expect(audio_spy).toHaveBeenCalledTimes(1);
	});
});
