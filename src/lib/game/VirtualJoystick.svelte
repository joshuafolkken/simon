<script lang="ts">
	import { onMount } from 'svelte';
	import nipplejs from 'nipplejs';
	import { input } from '$lib/game/input.svelte';
	import { messages } from '$lib/messages/en';

	type JoystickMgr = ReturnType<typeof nipplejs.create>;

	let move_zone: HTMLElement;
	let look_zone: HTMLElement;
	let move_mgr: JoystickMgr | undefined;
	let look_mgr: JoystickMgr | undefined;

	const JOYSTICK_SIZE = 80;

	function create_move_manager(): void {
		move_mgr = nipplejs.create({
			zone: move_zone,
			mode: 'static',
			position: { left: '25%', top: '50%' },
			size: JOYSTICK_SIZE,
			color: 'rgba(255,255,255,0.5)'
		});
		move_mgr.on('move', (evt) => {
			input.set_joystick_move(evt.data.vector.x, evt.data.vector.y);
		});
		move_mgr.on('end', () => input.set_joystick_move(0, 0));
	}

	function create_look_manager(): void {
		look_mgr = nipplejs.create({
			zone: look_zone,
			mode: 'static',
			position: { left: '75%', top: '50%' },
			size: JOYSTICK_SIZE,
			color: 'rgba(255,255,255,0.5)'
		});
		look_mgr.on('move', (evt) => {
			input.set_joystick_look(evt.data.vector.x, evt.data.vector.y);
		});
		look_mgr.on('end', () => input.set_joystick_look(0, 0));
	}

	onMount(() => {
		if (!('ontouchstart' in window)) return;
		create_move_manager();
		create_look_manager();
		return () => {
			move_mgr?.destroy();
			look_mgr?.destroy();
		};
	});
</script>

<div class="joystick-overlay" aria-hidden="true">
	<div class="joystick-zone" bind:this={move_zone}>
		<button
			class="sprint-btn"
			data-testid="sprint-btn"
			onpointerdown={() => input.set_sprinting(true)}
			onpointerup={() => input.set_sprinting(false)}
			onpointerleave={() => input.set_sprinting(false)}
		>
			{messages.sprint_button}
		</button>
		<button class="jump-btn" data-testid="jump-btn" onpointerdown={() => input.trigger_jump()}>
			{messages.jump_button}
		</button>
	</div>
	<div class="joystick-zone" bind:this={look_zone}></div>
</div>

<style>
	.joystick-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		pointer-events: none;
	}

	.joystick-zone {
		flex: 1;
		pointer-events: none;
		position: relative;
	}

	.sprint-btn {
		position: absolute;
		bottom: 20%;
		left: 25%;
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
		display: none;
	}

	.jump-btn {
		position: absolute;
		bottom: 20%;
		left: 45%;
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
		display: none;
	}

	@media (hover: none) and (pointer: coarse) {
		.joystick-zone {
			pointer-events: all;
		}

		.sprint-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.jump-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
