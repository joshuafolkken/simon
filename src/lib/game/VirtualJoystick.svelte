<script lang="ts">
	import { onMount } from 'svelte';
	import { input } from '$lib/game/input.svelte';
	import { messages } from '$lib/messages/en';
	import { override_event_offset } from '$lib/game/override-event-offset';

	let move_zone: HTMLElement;
	let look_zone: HTMLElement;

	const MOVE_MAX_DIST = 40;
	const MOVE_DEAD_ZONE = 6;
	const TOUCH_LOOK_SENSITIVITY = 0.009;
	const FIRST_MOVE_SENSITIVITY_FRACTION = 0.2;

	let move_touch_id: number | null = null;
	let move_start_x = 0;
	let move_start_y = 0;

	let look_touch_id: number | null = null;
	let look_last_x = 0;
	let look_last_y = 0;
	let look_start_x = 0;
	let look_start_y = 0;
	let look_is_first_move = false;

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

	type DispatchCtx = { dom: HTMLElement; offset_x: number; offset_y: number };

	function get_dispatch_ctx(x: number, y: number): DispatchCtx | null {
		const dom = get_threlte_dom();
		if (!dom) return null;
		const { left, top } = dom.getBoundingClientRect();
		return { dom, offset_x: x - left, offset_y: y - top };
	}

	function dispatch_pointer_down(
		pointer_id: number,
		is_primary: boolean,
		x: number,
		y: number
	): void {
		const ctx = get_dispatch_ctx(x, y);
		if (!ctx) return;
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
		override_event_offset(move_ev, ctx.offset_x, ctx.offset_y);
		override_event_offset(down_ev, ctx.offset_x, ctx.offset_y);
		ctx.dom.dispatchEvent(move_ev);
		ctx.dom.dispatchEvent(down_ev);
	}

	function dispatch_pointer_up(
		pointer_id: number,
		is_primary: boolean,
		x: number,
		y: number
	): void {
		const ctx = get_dispatch_ctx(x, y);
		if (!ctx) return;
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
		override_event_offset(up_ev, ctx.offset_x, ctx.offset_y);
		override_event_offset(click_ev, ctx.offset_x, ctx.offset_y);
		override_event_offset(leave_ev, ctx.offset_x, ctx.offset_y);
		ctx.dom.dispatchEvent(up_ev);
		ctx.dom.dispatchEvent(click_ev);
		ctx.dom.dispatchEvent(leave_ev);
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
		look_is_first_move = true;
		dispatch_pointer_down(t.identifier, move_touch_id === null, t.clientX, t.clientY);
	}

	function apply_dead_zone(raw: number): number {
		const abs = Math.abs(raw);
		if (abs < MOVE_DEAD_ZONE) return 0;
		return Math.sign(raw) * clamp((abs - MOVE_DEAD_ZONE) / (MOVE_MAX_DIST - MOVE_DEAD_ZONE), 0, 1);
	}

	function apply_move_touch(t: Touch): void {
		input.set_joystick_move(
			apply_dead_zone(t.clientX - move_start_x),
			apply_dead_zone(move_start_y - t.clientY)
		);
	}

	function apply_look_touch(t: Touch): void {
		const sensitivity = look_is_first_move
			? TOUCH_LOOK_SENSITIVITY * FIRST_MOVE_SENSITIVITY_FRACTION
			: TOUCH_LOOK_SENSITIVITY;
		look_is_first_move = false;
		input.apply_look_delta(
			(t.clientX - look_last_x) * sensitivity,
			(t.clientY - look_last_y) * sensitivity
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

	function on_jump_touch_start(e: TouchEvent): void {
		e.preventDefault();
		input.trigger_jump();
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
	<button
		class="jump-btn"
		data-testid="jump-btn"
		onclick={() => input.trigger_jump()}
		ontouchstart={on_jump_touch_start}
	>
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
