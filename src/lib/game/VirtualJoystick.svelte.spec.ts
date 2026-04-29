import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import VirtualJoystick from './VirtualJoystick.svelte';
import { input } from '$lib/game/input.svelte';

function make_touch(id: number, x: number, y: number, target: Element): Touch {
	return new Touch({ identifier: id, target, clientX: x, clientY: y });
}

function fire(type: string, target: EventTarget, changed: Touch[], all: Touch[]): void {
	target.dispatchEvent(
		new TouchEvent(type, { changedTouches: changed, touches: all, bubbles: true, cancelable: true })
	);
}

function setup_threlte_dom(): { dom: HTMLDivElement; canvas: HTMLCanvasElement } {
	const dom = document.createElement('div');
	const canvas = document.createElement('canvas');
	dom.appendChild(canvas);
	document.body.appendChild(dom);
	return { dom, canvas };
}

describe('VirtualJoystick', () => {
	it('renders jump button inside overlay but not inside any joystick zone', () => {
		const { container } = render(VirtualJoystick);
		const overlay = container.querySelector('.joystick-overlay');
		expect(overlay).toBeTruthy();
		if (!overlay) return;
		expect(overlay.querySelector('[data-testid="jump-btn"]')).toBeTruthy();
		const zones = container.querySelectorAll('.joystick-zone');
		for (let i = 0; i < zones.length; i++) {
			expect(zones[i]?.querySelector('[data-testid="jump-btn"]')).toBeNull();
		}
	});

	it('joystick-zone does not capture pointer events on non-touch devices', () => {
		const { container } = render(VirtualJoystick);
		const zone = container.querySelector<HTMLElement>('.joystick-zone');
		expect(zone).toBeTruthy();
		if (!zone) return;
		expect(getComputedStyle(zone).pointerEvents).toBe('none');
	});

	it('overlay has touch-action none to allow simultaneous two-finger input', () => {
		const { container } = render(VirtualJoystick);
		const overlay = container.querySelector<HTMLElement>('.joystick-overlay');
		expect(overlay).toBeTruthy();
		if (!overlay) return;
		expect(getComputedStyle(overlay).touchAction).toBe('none');
	});
});

describe('VirtualJoystick touch handlers', () => {
	beforeEach(() => {
		(globalThis as typeof globalThis & { ontouchstart: null }).ontouchstart = null;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		delete (globalThis as typeof globalThis & { ontouchstart?: null }).ontouchstart;
	});

	it('dragging move zone calls set_joystick_move with normalized vector', () => {
		const spy = vi.spyOn(input, 'set_joystick_move');
		const { container } = render(VirtualJoystick);
		const move_zone = container.querySelector('.joystick-zone');
		expect(move_zone).toBeTruthy();
		if (!move_zone) return;

		const t_start = make_touch(1, 100, 200, move_zone);
		fire('touchstart', move_zone, [t_start], [t_start]);

		const MOVE_MAX_DIST = 40;
		const t_move = make_touch(1, 100 + MOVE_MAX_DIST, 200, move_zone);
		fire('touchmove', document, [t_move], [t_move]);

		expect(spy).toHaveBeenCalledWith(1, 0);
	});

	it('dragging look zone calls apply_look_delta', () => {
		const spy = vi.spyOn(input, 'apply_look_delta');
		const { container } = render(VirtualJoystick);
		const look_zone = container.querySelectorAll('.joystick-zone').item(1);
		expect(look_zone).toBeTruthy();
		if (!look_zone) return;

		const t_start = make_touch(2, 300, 200, look_zone);
		fire('touchstart', look_zone, [t_start], [t_start]);

		const t_move = make_touch(2, 310, 190, look_zone);
		fire('touchmove', document, [t_move], [t_move]);

		expect(spy).toHaveBeenCalledOnce();
		const [delta_yaw, delta_pitch] = spy.mock.calls[0] ?? [0, 0];
		const TOUCH_LOOK_SENSITIVITY = 0.009;
		expect(delta_yaw).toBeCloseTo(10 * TOUCH_LOOK_SENSITIVITY);
		expect(delta_pitch).toBeCloseTo(-10 * TOUCH_LOOK_SENSITIVITY);
	});

	it('two simultaneous touches on both zones both get handled independently', () => {
		const move_spy = vi.spyOn(input, 'set_joystick_move');
		const look_spy = vi.spyOn(input, 'apply_look_delta');
		const { container } = render(VirtualJoystick);
		const zones = container.querySelectorAll('.joystick-zone');
		const move_zone = zones.item(0);
		const look_zone = zones.item(1);
		expect(move_zone).toBeTruthy();
		expect(look_zone).toBeTruthy();
		if (!move_zone || !look_zone) return;

		const t1 = make_touch(1, 100, 200, move_zone);
		fire('touchstart', move_zone, [t1], [t1]);
		const t2 = make_touch(2, 300, 200, look_zone);
		fire('touchstart', look_zone, [t2], [t2]);

		const t1m = make_touch(1, 120, 200, move_zone);
		const t2m = make_touch(2, 310, 190, look_zone);
		fire('touchmove', document, [t1m, t2m], [t1m, t2m]);

		expect(move_spy).toHaveBeenCalled();
		expect(look_spy).toHaveBeenCalled();
	});

	it('move zone touchend resets joystick to zero', () => {
		const spy = vi.spyOn(input, 'set_joystick_move');
		const { container } = render(VirtualJoystick);
		const move_zone = container.querySelector('.joystick-zone');
		expect(move_zone).toBeTruthy();
		if (!move_zone) return;

		const t = make_touch(1, 100, 200, move_zone);
		fire('touchstart', move_zone, [t], [t]);
		fire('touchend', document, [t], []);

		expect(spy).toHaveBeenLastCalledWith(0, 0);
	});

	it('touching move zone dispatches pointerdown to threlte dom (canvas parent)', () => {
		const { dom } = setup_threlte_dom();
		const spy = vi.fn();
		dom.addEventListener('pointerdown', spy);

		const { container } = render(VirtualJoystick);
		const move_zone = container.querySelector('.joystick-zone');
		expect(move_zone).toBeTruthy();
		if (!move_zone) return;

		const t = make_touch(1, 100, 200, move_zone);
		fire('touchstart', move_zone, [t], [t]);

		expect(spy).toHaveBeenCalledOnce();
		const pointer_event = spy.mock.calls[0]?.[0] as PointerEvent;
		expect(pointer_event.pointerId).toBe(1);
		expect(pointer_event.offsetX).toBe(100);
		expect(pointer_event.offsetY).toBe(200);
		dom.remove();
	});

	it('releasing move zone dispatches click to threlte dom at start position', () => {
		const { dom } = setup_threlte_dom();
		const spy = vi.fn();
		dom.addEventListener('click', spy);

		const { container } = render(VirtualJoystick);
		const move_zone = container.querySelector('.joystick-zone');
		expect(move_zone).toBeTruthy();
		if (!move_zone) return;

		const t = make_touch(1, 150, 250, move_zone);
		fire('touchstart', move_zone, [t], [t]);
		const t_end = make_touch(1, 200, 300, move_zone);
		fire('touchend', document, [t_end], []);

		expect(spy).toHaveBeenCalledOnce();
		const click_event = spy.mock.calls[0]?.[0] as MouseEvent;
		expect(click_event.clientX).toBe(150);
		expect(click_event.clientY).toBe(250);
		expect(click_event.offsetX).toBe(150);
		expect(click_event.offsetY).toBe(250);
		dom.remove();
	});

	it('releasing move zone dispatches pointerleave to threlte dom', () => {
		const { dom } = setup_threlte_dom();
		const spy = vi.fn();
		dom.addEventListener('pointerleave', spy);

		const { container } = render(VirtualJoystick);
		const move_zone = container.querySelector('.joystick-zone');
		expect(move_zone).toBeTruthy();
		if (!move_zone) return;

		const t = make_touch(1, 100, 200, move_zone);
		fire('touchstart', move_zone, [t], [t]);
		fire('touchend', document, [t], []);

		expect(spy).toHaveBeenCalledOnce();
		dom.remove();
	});

	it('touching look zone dispatches pointerdown to threlte dom', () => {
		const { dom } = setup_threlte_dom();
		const spy = vi.fn();
		dom.addEventListener('pointerdown', spy);

		const { container } = render(VirtualJoystick);
		const look_zone = container.querySelectorAll('.joystick-zone').item(1);
		expect(look_zone).toBeTruthy();
		if (!look_zone) return;

		const t = make_touch(2, 300, 200, look_zone);
		fire('touchstart', look_zone, [t], [t]);

		expect(spy).toHaveBeenCalledOnce();
		const pointer_event = spy.mock.calls[0]?.[0] as PointerEvent;
		expect(pointer_event.pointerId).toBe(2);
		expect(pointer_event.offsetX).toBe(300);
		expect(pointer_event.offsetY).toBe(200);
		dom.remove();
	});

	it('touchcancel does not dispatch click to threlte dom', () => {
		const { dom } = setup_threlte_dom();
		const click_spy = vi.fn();
		dom.addEventListener('click', click_spy);

		const { container } = render(VirtualJoystick);
		const move_zone = container.querySelector('.joystick-zone');
		expect(move_zone).toBeTruthy();
		if (!move_zone) return;

		const t = make_touch(1, 100, 200, move_zone);
		fire('touchstart', move_zone, [t], [t]);
		fire('touchcancel', document, [t], []);

		expect(click_spy).not.toHaveBeenCalled();
		dom.remove();
	});

	it('tapping jump button does not dispatch to threlte dom', () => {
		const { dom } = setup_threlte_dom();
		const spy = vi.fn();
		dom.addEventListener('pointerdown', spy);

		const { container } = render(VirtualJoystick);
		const jump_btn = container.querySelector<HTMLButtonElement>('[data-testid="jump-btn"]');
		expect(jump_btn).toBeTruthy();
		if (!jump_btn) return;

		const t = make_touch(2, 300, 200, jump_btn);
		fire('touchstart', jump_btn, [t], [t]);

		expect(spy).not.toHaveBeenCalled();
		dom.remove();
	});
});
