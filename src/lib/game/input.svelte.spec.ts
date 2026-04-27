import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { input } from '$lib/game/input.svelte';

describe('input', () => {
	let cleanup: () => void;

	beforeEach(() => {
		cleanup = input.setup_listeners();
	});

	afterEach(() => {
		cleanup();
	});

	it('starts with pointer not locked', () => {
		expect(input.is_pointer_locked).toBe(false);
	});

	it('maps w key to forward', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
		expect(input.keys.w).toBe(true);
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
		expect(input.keys.w).toBe(false);
	});

	it('maps ArrowUp to forward', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		expect(input.keys.w).toBe(true);
	});

	it('maps a key to left', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
		expect(input.keys.a).toBe(true);
	});

	it('maps d key to right', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
		expect(input.keys.d).toBe(true);
	});

	it('ignores unmapped keys', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
		expect(input.keys.w).toBe(false);
		expect(input.keys.a).toBe(false);
		expect(input.keys.s).toBe(false);
		expect(input.keys.d).toBe(false);
	});

	it('sets joystick move values', () => {
		input.set_joystick_move(0.5, -0.3);
		expect(input.joystick_move.x).toBe(0.5);
		expect(input.joystick_move.y).toBe(-0.3);
	});

	it('sets joystick look values', () => {
		input.set_joystick_look(0.8, 0.2);
		expect(input.joystick_look.x).toBe(0.8);
		expect(input.joystick_look.y).toBe(0.2);
	});

	it('apply_look_delta updates yaw and pitch', () => {
		input.apply_look_delta(0.1, 0.05);
		expect(input.yaw).toBeCloseTo(-0.1);
		expect(input.pitch).toBeCloseTo(-0.05);
	});

	it('clamps pitch at max value', () => {
		input.apply_look_delta(0, -100);
		expect(input.pitch).toBeGreaterThan(0);
		expect(input.pitch).toBeLessThan(Math.PI / 2);
	});

	it('clamps pitch at min value', () => {
		input.apply_look_delta(0, 100);
		expect(input.pitch).toBeLessThan(0);
		expect(input.pitch).toBeGreaterThan(-Math.PI / 2);
	});

	it('prevents default on arrow keys to stop page scroll', () => {
		const evt = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
		document.dispatchEvent(evt);
		expect(evt.defaultPrevented).toBe(true);
		expect(input.keys.w).toBe(true);
	});

	it('does not prevent default on letter keys', () => {
		const evt = new KeyboardEvent('keydown', { key: 'w', cancelable: true });
		document.dispatchEvent(evt);
		expect(evt.defaultPrevented).toBe(false);
	});

	it('resets keys on window blur to prevent stuck movement', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
		expect(input.keys.w).toBe(true);
		globalThis.dispatchEvent(new Event('blur'));
		expect(input.keys.w).toBe(false);
	});

	it('setup_listeners is idempotent when called twice', () => {
		const second_cleanup = input.setup_listeners();
		expect(second_cleanup).toBe(cleanup);
	});

	it('cleanup resets all state including joysticks', () => {
		input.set_joystick_move(1, 1);
		input.set_joystick_look(1, 1);
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
		cleanup();
		expect(input.keys.w).toBe(false);
		expect(input.joystick_move.x).toBe(0);
		expect(input.joystick_look.x).toBe(0);
		cleanup = input.setup_listeners();
	});

	it('Shift keydown sets is_sprinting true', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
		expect(input.is_sprinting).toBe(true);
	});

	it('Shift keyup sets is_sprinting false', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
		expect(input.is_sprinting).toBe(false);
	});

	it('set_sprinting toggles is_sprinting', () => {
		input.set_sprinting(true);
		expect(input.is_sprinting).toBe(true);
		input.set_sprinting(false);
		expect(input.is_sprinting).toBe(false);
	});

	it('Space keydown sets is_dashing true', () => {
		vi.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		expect(input.is_dashing).toBe(true);
		vi.useRealTimers();
	});

	it('is_dashing auto-clears after DASH_BURST_MS', async () => {
		vi.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		await vi.advanceTimersByTimeAsync(300);
		expect(input.is_dashing).toBe(false);
		vi.useRealTimers();
	});

	it('reset_keys clears is_sprinting and is_dashing', () => {
		vi.useFakeTimers();
		input.set_sprinting(true);
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		document.dispatchEvent(new KeyboardEvent('blur'));
		globalThis.dispatchEvent(new Event('blur'));
		expect(input.is_sprinting).toBe(false);
		expect(input.is_dashing).toBe(false);
		vi.useRealTimers();
	});
});
