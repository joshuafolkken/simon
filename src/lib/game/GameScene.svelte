<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Suspense } from '@threlte/extras';
	import { onMount } from 'svelte';
	import GameSceneObjects from './GameSceneObjects.svelte';
	import VirtualJoystick from './VirtualJoystick.svelte';
	import { input } from '$lib/game/input.svelte';
	import { audio } from '$lib/game/audio';
	import { messages } from '$lib/messages/en';
	import { game_state } from '$lib/game/state.svelte';
	import { fonts } from '$lib/game/fonts';
	import { fullscreen } from '$lib/game/fullscreen.svelte';
	import { loading } from '$lib/game/loading.svelte';
	import { device } from '$lib/game/device';

	const CLICK_HINT_BASE_FONT_SIZE_REM = 1;

	let container: HTMLElement;
	let did_start = $state(false);
	let is_dragging_look = $derived(input.is_dragging_look);
	let drag_start_x = $derived(input.drag_start_x);
	let drag_start_y = $derived(input.drag_start_y);
	let is_cyber = $derived(game_state.is_cyber);
	let is_pseudo_fullscreen = $derived(fullscreen.is_pseudo_fullscreen);
	let click_hint_font_family = $derived(fonts.get_font_family(is_cyber));
	let click_hint_font_size_rem = $derived(
		CLICK_HINT_BASE_FONT_SIZE_REM * fonts.get_font_size_multiplier(is_cyber)
	);

	function start_session(): void {
		if (did_start) return;
		audio.init_audio();
		if (container && device.is_touch_primary()) void fullscreen.request(container);
		did_start = true;
	}

	function on_scene_loaded(): void {
		loading.mark_ready();
	}

	onMount(() => {
		loading.set_step('loading_assets');
		const cleanup_input = input.setup_listeners();
		const cleanup_fullscreen = fullscreen.setup_listeners();
		return function cleanup(): void {
			cleanup_input();
			cleanup_fullscreen();
		};
	});
</script>

<div
	class="game-container"
	class:pseudo-fullscreen={is_pseudo_fullscreen}
	class:is-dragging-look={is_dragging_look}
	bind:this={container}
	onclick={start_session}
	data-testid="game-scene"
>
	{#if !did_start}
		<div
			class="click-hint"
			aria-live="polite"
			style:font-family={click_hint_font_family}
			style:font-size="{click_hint_font_size_rem}rem"
		>
			{messages.click_to_play}
		</div>
	{/if}
	{#if is_cyber}
		<div class="cyber-glow" data-testid="cyber-glow" aria-hidden="true"></div>
	{/if}
	<Canvas shadows>
		<Suspense onload={on_scene_loaded}>
			<GameSceneObjects />
		</Suspense>
	</Canvas>
	<VirtualJoystick />
	{#if is_dragging_look}
		<svg
			class="fake-cursor"
			data-testid="fake-cursor"
			aria-hidden="true"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			style:left="{drag_start_x}px"
			style:top="{drag_start_y}px"
		>
			<path
				d="M2 2 L2 16 L6 12 L9 18 L11 17 L8 11 L13 11 Z"
				fill="white"
				stroke="black"
				stroke-width="1"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</div>

<style>
	.game-container {
		position: relative;
		width: 100%;
		height: 100vh;
		background: #0d0d12;
	}

	.game-container.pseudo-fullscreen {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
	}

	.game-container.is-dragging-look {
		cursor: none;
	}

	.fake-cursor {
		position: fixed;
		pointer-events: none;
		z-index: 100;
		transform: translate(-2px, -2px);
	}

	.click-hint {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: rgba(255, 255, 255, 0.6);
		font-size: 1rem;
		letter-spacing: 0.2em;
		pointer-events: none;
		z-index: 10;
	}

	.cyber-glow {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 5;
		background: radial-gradient(
			ellipse at center,
			rgba(255, 0, 255, 0.12) 0%,
			rgba(100, 0, 255, 0.06) 50%,
			transparent 70%
		);
		mix-blend-mode: screen;
		animation: cyber-pulse 2s ease-in-out infinite;
	}

	@keyframes cyber-pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}
</style>
