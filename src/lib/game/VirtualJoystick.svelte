<script lang="ts">
	import { onMount } from 'svelte';
	import { input } from '$lib/game/input.svelte';
	import { messages } from '$lib/messages/en';

	let move_zone: HTMLElement;
	let look_zone: HTMLElement;

	const MOVE_MAX_DIST = 40;
	const TOUCH_LOOK_SENSITIVITY = 0.009;

	let move_touch_id: number | null = null;
	let move_start_x = 0;
	let move_start_y = 0;

	let look_touch_id: number | null = null;
	let look_last_x = 0;
	let look_last_y = 0;
	let look_start_x = 0;
	let look_start_y = 0;

	function find_touch(list: TouchList, id: number): Touch | undefined {
		for (let i = 0; i < list.length; i++) {
			const t = list[i];
			if (t && t.identifier === id) return t;
		}
		return undefined;
	}

	function clamp(v: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, v));
	}

	function get_threlte_dom(): HTMLElement | null {
		return document.querySelector('canvas')?.parentElement ?? null;
	}

	function override_offset(event: Event, offset_x: number, offset_y: number): void {
		try {
			Object.defineProperty(event, 'offsetX', { get: () => offset_x, configurable: true });
			Object.defineProperty(event, 'offsetY', { get: () => offset_y, configurable: true });
		} catch {
			/* ignore browsers that disallow override */
		}
	}

	function dispatch_pointer_down(
		pointer_id: number,
		is_primary: boolean,
		x: number,
		y: number
	): void {
		const dom = get_threlte_dom();
		if (!dom) return;
		const rect = dom.getBoundingClientRect();
		const offset_x = x - rect.left;
		const offset_y = y - rect.top;
		const opts = {
			button: 0,
			buttons: 1,
			isPrimary: is_primary,
			pointerId: pointer_id,
			clientX: x,
			clientY: y,
			bubbles: true,
			cancelable: true
		};
		const move_ev = new PointerEvent('pointermove', opts);
		const down_ev = new PointerEvent('pointerdown', opts);
		override_offset(move_ev, offset_x, offset_y);
		override_offset(down_ev, offset_x, offset_y);
		dom.dispatchEvent(move_ev);
		dom.dispatchEvent(down_ev);
	}

	function dispatch_pointer_up(
		pointer_id: number,
		is_primary: boolean,
		x: number,
		y: number
	): void {
		const dom = get_threlte_dom();
		if (!dom) return;
		const rect = dom.getBoundingClientRect();
		const offset_x = x - rect.left;
		const offset_y = y - rect.top;
		const opts = {
			button: 0,
			buttons: 0,
			isPrimary: is_primary,
			pointerId: pointer_id,
			clientX: x,
			clientY: y,
			bubbles: true,
			cancelable: true
		};
		const up_ev = new PointerEvent('pointerup', opts);
		const click_ev = new MouseEvent('click', opts);
		const leave_ev = new PointerEvent('pointerleave', opts);
		override_offset(up_ev, offset_x, offset_y);
		override_offset(click_ev, offset_x, offset_y);
		override_offset(leave_ev, offset_x, offset_y);
		dom.dispatchEvent(up_ev);
		dom.dispatchEvent(click_ev);
		dom.dispatchEvent(leave_ev);
	}

	function on_move_start(e: TouchEvent): void {
		if (move_touch_id !== null) return;
		const t = e.changedTouches[0];
		if (!t) return;
		move_touch_id = t.identifier;
		move_start_x = t.clientX;
		move_start_y = t.clientY;
		dispatch_pointer_down(t.identifier, look_touch_id === null, t.clientX, t.clientY);
	}

	function on_look_start(e: TouchEvent): void {
		if (look_touch_id !== null) return;
		if (e.target instanceof HTMLButtonElement) return;
		const t = e.changedTouches[0];
		if (!t) return;
		look_touch_id = t.identifier;
		look_last_x = t.clientX;
		look_last_y = t.clientY;
		look_start_x = t.clientX;
		look_start_y = t.clientY;
		dispatch_pointer_down(t.identifier, move_touch_id === null, t.clientX, t.clientY);
	}

	function apply_move_touch(t: Touch): void {
		const dx = clamp((t.clientX - move_start_x) / MOVE_MAX_DIST, -1, 1);
		const dy = clamp((move_start_y - t.clientY) / MOVE_MAX_DIST, -1, 1);
		input.set_joystick_move(dx, dy);
	}

	function apply_look_touch(t: Touch): void {
		input.apply_look_delta(
			(t.clientX - look_last_x) * TOUCH_LOOK_SENSITIVITY,
			(t.clientY - look_last_y) * TOUCH_LOOK_SENSITIVITY
		);
		look_last_x = t.clientX;
		look_last_y = t.clientY;
	}

	function on_touch_move(e: TouchEvent): void {
		if (move_touch_id !== null) {
			const t = find_touch(e.changedTouches, move_touch_id);
			if (t) apply_move_touch(t);
		}
		if (look_touch_id !== null) {
			const t = find_touch(e.changedTouches, look_touch_id);
			if (t) apply_look_touch(t);
		}
	}

	function on_move_touch_end(ptr_id: number): void {
		move_touch_id = null;
		input.set_joystick_move(0, 0);
		dispatch_pointer_up(ptr_id, look_touch_id === null, move_start_x, move_start_y);
	}

	function on_look_touch_end(ptr_id: number): void {
		look_touch_id = null;
		dispatch_pointer_up(ptr_id, move_touch_id === null, look_start_x, look_start_y);
	}

	function cancel_touch_by_id(id: number): void {
		if (id === move_touch_id) {
			move_touch_id = null;
			input.set_joystick_move(0, 0);
		}
		if (id === look_touch_id) look_touch_id = null;
	}

	function on_touch_end(e: TouchEvent): void {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const touch = e.changedTouches[i];
			if (!touch) continue;
			if (touch.identifier === move_touch_id) on_move_touch_end(touch.identifier);
			if (touch.identifier === look_touch_id) on_look_touch_end(touch.identifier);
		}
	}

	function on_touch_cancel(e: TouchEvent): void {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const touch = e.changedTouches[i];
			if (touch) cancel_touch_by_id(touch.identifier);
		}
	}

	onMount(() => {
		if (!('ontouchstart' in window)) return;
		move_zone.addEventListener('touchstart', on_move_start, { passive: false });
		look_zone.addEventListener('touchstart', on_look_start, { passive: false });
		document.addEventListener('touchmove', on_touch_move, { passive: false });
		document.addEventListener('touchend', on_touch_end);
		document.addEventListener('touchcancel', on_touch_cancel);
		return () => {
			move_zone.removeEventListener('touchstart', on_move_start);
			look_zone.removeEventListener('touchstart', on_look_start);
			document.removeEventListener('touchmove', on_touch_move);
			document.removeEventListener('touchend', on_touch_end);
			document.removeEventListener('touchcancel', on_touch_cancel);
		};
	});
</script>

<div class="joystick-overlay">
	<div class="joystick-zone" aria-hidden="true" bind:this={move_zone}></div>
	<div class="joystick-zone" aria-hidden="true" bind:this={look_zone}></div>
	<button class="jump-btn" data-testid="jump-btn" onclick={() => input.trigger_jump()}>
		{messages.jump_button}
	</button>
</div>

<style>
	.joystick-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		pointer-events: none;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	.joystick-zone {
		flex: 1;
		pointer-events: none;
		position: relative;
	}

	.jump-btn {
		position: absolute;
		bottom: 20%;
		left: 75%;
		transform: translateX(-50%);
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		border: 2px solid rgba(255, 255, 255, 0.5);
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		pointer-events: all;
		touch-action: none;
		user-select: none;
		display: none;
	}

	@media (hover: none) and (pointer: coarse) {
		.joystick-zone {
			pointer-events: all;
			touch-action: none;
		}

		.jump-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
