import { override_event_offset } from '$lib/game/override-event-offset';

const MOUSE_SENSITIVITY = 0.004;
const WHEEL_SENSITIVITY = 0.004;
const MAX_PITCH = Math.PI / 2 - 0.01;
const RIGHT_MOUSE_BUTTON = 2;

type Keys = { w: boolean; a: boolean; s: boolean; d: boolean };
type Vec2 = { x: number; y: number };

let is_dragging_look = $state(false);
let drag_start_x = $state(0);
let drag_start_y = $state(0);
let yaw = $state(0);
let pitch = $state(0);
let keys = $state<Keys>({ w: false, a: false, s: false, d: false });
let is_sprinting = $state(false);
let is_jump_requested = $state(false);
let active_cleanup: (() => void) | null = null;
const joystick_move = $state<Vec2>({ x: 0, y: 0 });
const joystick_look = $state<Vec2>({ x: 0, y: 0 });

const KEY_MAP: Record<string, keyof Keys> = {
	w: 'w',
	W: 'w',
	ArrowUp: 'w',
	a: 'a',
	A: 'a',
	ArrowLeft: 'a',
	s: 's',
	S: 's',
	ArrowDown: 's',
	d: 'd',
	D: 'd',
	ArrowRight: 'd'
};

function clamp_pitch(value: number): number {
	return Math.max(-MAX_PITCH, Math.min(MAX_PITCH, value));
}

function on_mouse_down(e: MouseEvent): void {
	if (e.button !== RIGHT_MOUSE_BUTTON) return;
	drag_start_x = e.clientX;
	drag_start_y = e.clientY;
	is_dragging_look = true;
	if (e.target instanceof HTMLElement) void e.target.requestPointerLock?.();
}

function on_mouse_up(e: MouseEvent): void {
	if (e.button !== RIGHT_MOUSE_BUTTON) return;
	is_dragging_look = false;
	if (document.pointerLockElement) document.exitPointerLock();
}

function on_mouse_move(e: MouseEvent): void {
	if (!is_dragging_look) return;
	yaw -= e.movementX * MOUSE_SENSITIVITY;
	pitch = clamp_pitch(pitch - e.movementY * MOUSE_SENSITIVITY);
}

function on_pointer_lock_change(): void {
	if (!document.pointerLockElement) is_dragging_look = false;
}

function on_wheel(e: WheelEvent): void {
	e.preventDefault();
	yaw += e.deltaX * WHEEL_SENSITIVITY;
	pitch = clamp_pitch(pitch + e.deltaY * WHEEL_SENSITIVITY);
}

function on_context_menu(e: MouseEvent): void {
	e.preventDefault();
}

function override_offset_during_drag(event: Event): void {
	if (!is_dragging_look) return;
	if (!(event.target instanceof HTMLElement)) return;
	const rect = event.target.getBoundingClientRect();
	override_event_offset(event, drag_start_x - rect.left, drag_start_y - rect.top);
}

function dispatch_synthetic_pointer_event(type: 'pointerdown' | 'pointerup'): void {
	const canvas = document.querySelector('canvas');
	if (!canvas) return;
	const synth = new PointerEvent(type, {
		button: 0,
		clientX: drag_start_x,
		clientY: drag_start_y,
		bubbles: true,
		cancelable: true
	});
	canvas.dispatchEvent(synth);
}

function on_left_mouse_for_synth(e: MouseEvent): void {
	if (!is_dragging_look) return;
	if (e.button !== 0) return;
	if (e.type === 'mousedown') dispatch_synthetic_pointer_event('pointerdown');
	else if (e.type === 'mouseup') dispatch_synthetic_pointer_event('pointerup');
}

function trigger_jump(): void {
	is_jump_requested = true;
}

function clear_jump_request(): void {
	is_jump_requested = false;
}

function set_sprinting(value: boolean): void {
	is_sprinting = value;
}

function on_key(e: KeyboardEvent, is_down: boolean): void {
	if (e.key === 'Shift') {
		set_sprinting(is_down);
		return;
	}
	if (is_down && e.key === ' ') {
		trigger_jump();
		return;
	}
	const key = KEY_MAP[e.key];
	if (!key) return;
	keys[key] = is_down;
	if (e.key.startsWith('Arrow')) e.preventDefault();
}

function handle_keydown(e: KeyboardEvent): void {
	on_key(e, true);
}

function handle_keyup(e: KeyboardEvent): void {
	on_key(e, false);
}

function reset_transient_input(): void {
	keys = { w: false, a: false, s: false, d: false };
	is_sprinting = false;
	is_jump_requested = false;
	is_dragging_look = false;
}

type ListenerSpec = {
	target: EventTarget;
	type: string;
	handler: EventListener;
	options?: AddEventListenerOptions;
};

const PASSIVE_FALSE: AddEventListenerOptions = { passive: false };
const CAPTURE: AddEventListenerOptions = { capture: true };

function get_listener_specs(): readonly ListenerSpec[] {
	return [
		{ target: document, type: 'mousedown', handler: on_mouse_down as EventListener },
		{ target: document, type: 'mousemove', handler: on_mouse_move as EventListener },
		{ target: document, type: 'mouseup', handler: on_mouse_up as EventListener },
		{
			target: document,
			type: 'mousedown',
			handler: on_left_mouse_for_synth as EventListener,
			options: CAPTURE
		},
		{
			target: document,
			type: 'mouseup',
			handler: on_left_mouse_for_synth as EventListener,
			options: CAPTURE
		},
		{ target: document, type: 'wheel', handler: on_wheel as EventListener, options: PASSIVE_FALSE },
		{ target: document, type: 'contextmenu', handler: on_context_menu as EventListener },
		{ target: document, type: 'pointerlockchange', handler: on_pointer_lock_change },
		{
			target: document,
			type: 'pointerdown',
			handler: override_offset_during_drag,
			options: CAPTURE
		},
		{ target: document, type: 'pointerup', handler: override_offset_during_drag, options: CAPTURE },
		{
			target: document,
			type: 'pointermove',
			handler: override_offset_during_drag,
			options: CAPTURE
		},
		{ target: document, type: 'click', handler: override_offset_during_drag, options: CAPTURE },
		{ target: document, type: 'keydown', handler: handle_keydown as EventListener },
		{ target: document, type: 'keyup', handler: handle_keyup as EventListener },
		{ target: globalThis, type: 'blur', handler: reset_transient_input }
	];
}

function setup_listeners(): () => void {
	if (active_cleanup) return active_cleanup;
	const specs = get_listener_specs();
	for (const spec of specs) spec.target.addEventListener(spec.type, spec.handler, spec.options);
	active_cleanup = function cleanup(): void {
		for (const spec of specs)
			spec.target.removeEventListener(spec.type, spec.handler, spec.options);
		active_cleanup = null;
		yaw = 0;
		pitch = 0;
		reset_transient_input();
		set_joystick_move(0, 0);
		set_joystick_look(0, 0);
	};
	return active_cleanup;
}

function set_joystick_move(x: number, y: number): void {
	joystick_move.x = x;
	joystick_move.y = y;
}

function set_joystick_look(x: number, y: number): void {
	joystick_look.x = x;
	joystick_look.y = y;
}

function apply_look_delta(delta_yaw: number, delta_pitch: number): void {
	yaw -= delta_yaw;
	pitch = clamp_pitch(pitch - delta_pitch);
}

export const input = {
	get is_dragging_look() {
		return is_dragging_look;
	},
	get drag_start_x() {
		return drag_start_x;
	},
	get drag_start_y() {
		return drag_start_y;
	},
	get yaw() {
		return yaw;
	},
	get pitch() {
		return pitch;
	},
	get keys() {
		return keys;
	},
	get is_sprinting() {
		return is_sprinting;
	},
	get is_jump_requested() {
		return is_jump_requested;
	},
	get joystick_move() {
		return joystick_move;
	},
	get joystick_look() {
		return joystick_look;
	},
	setup_listeners,
	set_joystick_move,
	set_joystick_look,
	set_sprinting,
	trigger_jump,
	clear_jump_request,
	apply_look_delta
};
