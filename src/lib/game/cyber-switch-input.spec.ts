import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cyber_switch_input } from './cyber-switch-input';
import { session } from './session.svelte';
import { game_state } from './state.svelte';
import { switch_audio } from '$lib/game/switch-audio';

describe('cyber_switch_input', () => {
	beforeEach(() => {
		session.reset_session();
		game_state.return_to_title();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not toggle cyber when session is not started', () => {
		expect(game_state.is_cyber).toBe(true);
		cyber_switch_input.on_click();
		expect(game_state.is_cyber).toBe(true);
	});

	it('toggles cyber once session has started', () => {
		session.start_session();
		expect(game_state.is_cyber).toBe(true);
		cyber_switch_input.on_click();
		expect(game_state.is_cyber).toBe(false);
	});

	it('toggles back when called twice after session started', () => {
		session.start_session();
		cyber_switch_input.on_click();
		cyber_switch_input.on_click();
		expect(game_state.is_cyber).toBe(true);
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
