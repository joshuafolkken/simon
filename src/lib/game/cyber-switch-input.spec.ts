import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cyber_switch_input } from './cyber-switch-input';
import { session } from './session.svelte';
import { switch_audio } from '$lib/game/switch-audio';

describe('cyber_switch_input', () => {
	let toggle_mock: ReturnType<typeof vi.fn<() => void>>;

	beforeEach(() => {
		session.reset_session();
		toggle_mock = vi.fn<() => void>();
		cyber_switch_input.configure({ on_toggle: toggle_mock });
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not call on_toggle when session is not started', () => {
		cyber_switch_input.on_click();
		expect(toggle_mock).not.toHaveBeenCalled();
	});

	it('calls on_toggle once session has started', () => {
		session.start_session();
		cyber_switch_input.on_click();
		expect(toggle_mock).toHaveBeenCalledTimes(1);
	});

	it('calls on_toggle twice when clicked twice after session started', () => {
		session.start_session();
		cyber_switch_input.on_click();
		cyber_switch_input.on_click();
		expect(toggle_mock).toHaveBeenCalledTimes(2);
	});

	it('plays switch click sound when session is started', () => {
		session.start_session();
		const spy = vi.spyOn(switch_audio, 'play_switch_click').mockImplementation(() => {});
		cyber_switch_input.on_click();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('does not play switch click sound when session is not started', () => {
		const spy = vi.spyOn(switch_audio, 'play_switch_click').mockImplementation(() => {});
		cyber_switch_input.on_click();
		expect(spy).not.toHaveBeenCalled();
	});
});
