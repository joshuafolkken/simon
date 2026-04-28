import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { input } from '$lib/game/input.svelte';

const RIGHT_BUTTON = 2;
const LEFT_BUTTON = 0;

function dispatch_mouse(type: string, init: MouseEventInit): void {
	document.dispatchEvent(new MouseEvent(type, init));
}

function dispatch_wheel(init: WheelEventInit): WheelEvent {
	const evt = new WheelEvent('wheel', { ...init, cancelable: true });
	document.dispatchEvent(evt);
	return evt;
}

function start_right_drag(): void {
	dispatch_mouse('mousedown', { button: RIGHT_BUTTON });
}

function end_right_drag(): void {
	dispatch_mouse('mouseup', { button: RIGHT_BUTTON });
}

describe('input', () => {
	let cleanup: () => void;

	beforeEach(() => {
		cleanup = input.setup_listeners();
	});

	afterEach(() => {
		cleanup();
	});

	it('starts with look-drag inactive', () => {
		expect(input.is_dragging_look).toBe(false);
	});

	it('right mouse down then mousemove updates yaw and pitch', () => {
		start_right_drag();
		dispatch_mouse('mousemove', { movementX: 100, movementY: 50 });
		expect(input.yaw).not.toBe(0);
		expect(input.pitch).not.toBe(0);
	});

	it('right-drag with positive movementX increases yaw (drag-the-world feel)', () => {
		start_right_drag();
		dispatch_mouse('mousemove', { movementX: 100, movementY: 0 });
		expect(input.yaw).toBeGreaterThan(0);
	});

	it('right-drag with positive movementY increases pitch (drag-the-world feel)', () => {
		start_right_drag();
		dispatch_mouse('mousemove', { movementX: 0, movementY: 100 });
		expect(input.pitch).toBeGreaterThan(0);
	});

	it('right-drag yaw scales by sensitivity (0.004 per pixel of movementX)', () => {
		start_right_drag();
		dispatch_mouse('mousemove', { movementX: 100, movementY: 0 });
		expect(input.yaw).toBeCloseTo(0.4);
	});

	it('left mouse down then mousemove does not update yaw or pitch', () => {
		dispatch_mouse('mousedown', { button: LEFT_BUTTON });
		dispatch_mouse('mousemove', { movementX: 100, movementY: 50 });
		expect(input.yaw).toBe(0);
		expect(input.pitch).toBe(0);
	});

	it('mousemove without any drag does not update yaw or pitch', () => {
		dispatch_mouse('mousemove', { movementX: 100, movementY: 50 });
		expect(input.yaw).toBe(0);
		expect(input.pitch).toBe(0);
	});

	it('right mouse up stops the drag', () => {
		start_right_drag();
		end_right_drag();
		dispatch_mouse('mousemove', { movementX: 100, movementY: 50 });
		expect(input.yaw).toBe(0);
		expect(input.pitch).toBe(0);
	});

	it('left mouse up does not end an active right drag', () => {
		start_right_drag();
		dispatch_mouse('mouseup', { button: LEFT_BUTTON });
		dispatch_mouse('mousemove', { movementX: 100, movementY: 0 });
		expect(input.yaw).not.toBe(0);
	});

	it('wheel event updates yaw and pitch from deltaX/deltaY', () => {
		dispatch_wheel({ deltaX: 50, deltaY: 30 });
		expect(input.yaw).not.toBe(0);
		expect(input.pitch).not.toBe(0);
	});

	it('wheel with positive deltaX increases yaw (drag-the-world feel)', () => {
		dispatch_wheel({ deltaX: 50, deltaY: 0 });
		expect(input.yaw).toBeGreaterThan(0);
	});

	it('wheel with positive deltaY increases pitch (drag-the-world feel)', () => {
		dispatch_wheel({ deltaX: 0, deltaY: 50 });
		expect(input.pitch).toBeGreaterThan(0);
	});

	it('wheel yaw scales by sensitivity (0.004 per unit of deltaX)', () => {
		dispatch_wheel({ deltaX: 100, deltaY: 0 });
		expect(input.yaw).toBeCloseTo(0.4);
	});

	it('wheel event preventDefault is called', () => {
		const evt = dispatch_wheel({ deltaX: 10, deltaY: 0 });
		expect(evt.defaultPrevented).toBe(true);
	});

	it('contextmenu preventDefault is called', () => {
		const evt = new MouseEvent('contextmenu', { cancelable: true });
		document.dispatchEvent(evt);
		expect(evt.defaultPrevented).toBe(true);
	});

	it('clamps pitch at max during right drag', () => {
		start_right_drag();
		dispatch_mouse('mousemove', { movementX: 0, movementY: 100000 });
		expect(input.pitch).toBeGreaterThan(0);
		expect(input.pitch).toBeLessThan(Math.PI / 2);
	});

	it('clamps pitch at min during right drag', () => {
		start_right_drag();
		dispatch_mouse('mousemove', { movementX: 0, movementY: -100000 });
		expect(input.pitch).toBeLessThan(0);
		expect(input.pitch).toBeGreaterThan(-Math.PI / 2);
	});

	it('clamps pitch at max during wheel', () => {
		dispatch_wheel({ deltaX: 0, deltaY: 100000 });
		expect(input.pitch).toBeGreaterThan(0);
		expect(input.pitch).toBeLessThan(Math.PI / 2);
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

	it('apply_look_delta clamps pitch at max', () => {
		input.apply_look_delta(0, -100);
		expect(input.pitch).toBeGreaterThan(0);
		expect(input.pitch).toBeLessThan(Math.PI / 2);
	});

	it('apply_look_delta clamps pitch at min', () => {
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

	it('cleanup resets all state including drag and joysticks', () => {
		start_right_drag();
		input.set_joystick_move(1, 1);
		input.set_joystick_look(1, 1);
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
		cleanup();
		expect(input.is_dragging_look).toBe(false);
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

	it('Space keydown sets is_jump_requested true', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		expect(input.is_jump_requested).toBe(true);
	});

	it('clear_jump_request clears is_jump_requested', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		input.clear_jump_request();
		expect(input.is_jump_requested).toBe(false);
	});

	it('reset_keys clears is_sprinting and is_jump_requested', () => {
		input.set_sprinting(true);
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		globalThis.dispatchEvent(new Event('blur'));
		expect(input.is_sprinting).toBe(false);
		expect(input.is_jump_requested).toBe(false);
	});
});
