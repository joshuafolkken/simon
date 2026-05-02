import { describe, it, expect, beforeEach } from 'vitest';
import { fps } from './fps.svelte.js';

it('starts with fps enabled', () => {
	expect(fps.is_fps_enabled).toBe(true);
});

it('starts with fps text as ---', () => {
	expect(fps.current_fps_text).toBe('---');
});

describe('fps', () => {
	beforeEach(() => {
		if (fps.is_fps_enabled) fps.toggle();
		fps.set_fps_text('---');
	});

	it('toggle enables FPS when disabled', () => {
		fps.toggle();
		expect(fps.is_fps_enabled).toBe(true);
	});

	it('toggle disables FPS when enabled', () => {
		fps.toggle();
		fps.toggle();
		expect(fps.is_fps_enabled).toBe(false);
	});

	it('toggle alternates state on each call', () => {
		fps.toggle();
		expect(fps.is_fps_enabled).toBe(true);
		fps.toggle();
		expect(fps.is_fps_enabled).toBe(false);
		fps.toggle();
		expect(fps.is_fps_enabled).toBe(true);
	});

	it('current_fps_text starts as ---', () => {
		expect(fps.current_fps_text).toBe('---');
	});

	it('set_fps_text updates current_fps_text', () => {
		fps.set_fps_text('60');
		expect(fps.current_fps_text).toBe('60');
	});

	it('disabling fps resets current_fps_text to ---', () => {
		fps.toggle();
		fps.set_fps_text('60');
		fps.toggle();
		expect(fps.current_fps_text).toBe('---');
	});
});
