const MOUSE_SENSITIVITY = 0.004;
const WHEEL_SENSITIVITY = 0.004;
const MAX_PITCH = Math.PI / 2 - 0.01;
const RIGHT_MOUSE_BUTTON = 2;

type Keys = { w: boolean; a: boolean; s: boolean; d: boolean };
type Vec2 = { x: number; y: number };

let is_dragging_look = $state(false);
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
	is_dragging_look = true;
}

function on_mouse_up(e: MouseEvent): void {
	if (e.button !== RIGHT_MOUSE_BUTTON) return;
	is_dragging_look = false;
}

function on_mouse_move(e: MouseEvent): void {
	if (!is_dragging_look) return;
	yaw += e.movementX * MOUSE_SENSITIVITY;
	pitch = clamp_pitch(pitch + e.movementY * MOUSE_SENSITIVITY);
}

function on_wheel(e: WheelEvent): void {
	e.preventDefault();
	yaw += e.deltaX * WHEEL_SENSITIVITY;
	pitch = clamp_pitch(pitch + e.deltaY * WHEEL_SENSITIVITY);
}

function on_context_menu(e: MouseEvent): void {
	e.preventDefault();
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

function setup_listeners(): () => void {
	if (active_cleanup) return active_cleanup;
	document.addEventListener('mousedown', on_mouse_down);
	document.addEventListener('mousemove', on_mouse_move);
	document.addEventListener('mouseup', on_mouse_up);
	document.addEventListener('wheel', on_wheel, { passive: false });
	document.addEventListener('contextmenu', on_context_menu);
	document.addEventListener('keydown', handle_keydown);
	document.addEventListener('keyup', handle_keyup);
	globalThis.addEventListener('blur', reset_transient_input);
	active_cleanup = build_cleanup();
	return active_cleanup;
}

function build_cleanup(): () => void {
	return function cleanup(): void {
		document.removeEventListener('mousedown', on_mouse_down);
		document.removeEventListener('mousemove', on_mouse_move);
		document.removeEventListener('mouseup', on_mouse_up);
		document.removeEventListener('wheel', on_wheel);
		document.removeEventListener('contextmenu', on_context_menu);
		document.removeEventListener('keydown', handle_keydown);
		document.removeEventListener('keyup', handle_keyup);
		globalThis.removeEventListener('blur', reset_transient_input);
		active_cleanup = null;
		yaw = 0;
		pitch = 0;
		reset_transient_input();
		set_joystick_move(0, 0);
		set_joystick_look(0, 0);
	};
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
