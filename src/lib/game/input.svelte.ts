const MOUSE_SENSITIVITY = 0.002;
const MAX_PITCH = Math.PI / 2 - 0.01;

type Keys = { w: boolean; a: boolean; s: boolean; d: boolean };
type Vec2 = { x: number; y: number };

let is_pointer_locked = $state(false);
let yaw = $state(0);
let pitch = $state(0);
let keys = $state<Keys>({ w: false, a: false, s: false, d: false });
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

function on_pointer_lock_change(): void {
	is_pointer_locked = document.pointerLockElement !== null;
}

function on_mouse_move(e: MouseEvent): void {
	if (!is_pointer_locked) return;
	yaw -= e.movementX * MOUSE_SENSITIVITY;
	pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch - e.movementY * MOUSE_SENSITIVITY));
}

function on_key(e: KeyboardEvent, is_down: boolean): void {
	const key = KEY_MAP[e.key];
	if (key) keys[key] = is_down;
}

function handle_keydown(e: KeyboardEvent): void {
	on_key(e, true);
}

function handle_keyup(e: KeyboardEvent): void {
	on_key(e, false);
}

function setup_listeners(): () => void {
	document.addEventListener('pointerlockchange', on_pointer_lock_change);
	document.addEventListener('mousemove', on_mouse_move);
	document.addEventListener('keydown', handle_keydown);
	document.addEventListener('keyup', handle_keyup);
	return function cleanup(): void {
		document.removeEventListener('pointerlockchange', on_pointer_lock_change);
		document.removeEventListener('mousemove', on_mouse_move);
		document.removeEventListener('keydown', handle_keydown);
		document.removeEventListener('keyup', handle_keyup);
		is_pointer_locked = false;
		yaw = 0;
		pitch = 0;
		keys = { w: false, a: false, s: false, d: false };
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
	pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch - delta_pitch));
}

export const input = {
	get is_pointer_locked() {
		return is_pointer_locked;
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
	get joystick_move() {
		return joystick_move;
	},
	get joystick_look() {
		return joystick_look;
	},
	setup_listeners,
	set_joystick_move,
	set_joystick_look,
	apply_look_delta
};
