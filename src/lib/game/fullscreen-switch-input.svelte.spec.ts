import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fullscreen_switch_input } from './fullscreen-switch-input';
import { fullscreen } from '$lib/game/fullscreen.svelte';
import { session } from '$lib/game/session.svelte';

describe('fullscreen_switch_input', () => {
	let container: HTMLElement;
	let cleanup_fullscreen: () => void;

	beforeEach(() => {
		session.reset_session();
		cleanup_fullscreen = fullscreen.setup_listeners();
		container = document.createElement('div');
		document.body.appendChild(container);
		fullscreen_switch_input.set_container(container);
	});

	afterEach(() => {
		fullscreen_switch_input.set_container(null);
		container.remove();
		cleanup_fullscreen();
		vi.restoreAllMocks();
	});

	it('does nothing when session is not started', () => {
		const request_spy = vi.spyOn(fullscreen, 'request').mockResolvedValue();
		const exit_spy = vi.spyOn(fullscreen, 'exit').mockResolvedValue();
		fullscreen_switch_input.on_click();
		expect(request_spy).not.toHaveBeenCalled();
		expect(exit_spy).not.toHaveBeenCalled();
	});

	it('does nothing when container is not set', () => {
		fullscreen_switch_input.set_container(null);
		session.start_session();
		const request_spy = vi.spyOn(fullscreen, 'request').mockResolvedValue();
		fullscreen_switch_input.on_click();
		expect(request_spy).not.toHaveBeenCalled();
	});

	it('requests fullscreen when inactive', () => {
		session.start_session();
		const request_spy = vi.spyOn(fullscreen, 'request').mockResolvedValue();
		fullscreen_switch_input.on_click();
		expect(request_spy).toHaveBeenCalledWith(container);
	});

	it('exits fullscreen when active', () => {
		session.start_session();
		vi.spyOn(fullscreen, 'is_active', 'get').mockReturnValue(true);
		const exit_spy = vi.spyOn(fullscreen, 'exit').mockResolvedValue();
		fullscreen_switch_input.on_click();
		expect(exit_spy).toHaveBeenCalledTimes(1);
	});
});
