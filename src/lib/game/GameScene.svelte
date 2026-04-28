<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import GameSceneObjects from './GameSceneObjects.svelte';
	import VirtualJoystick from './VirtualJoystick.svelte';
	import { input } from '$lib/game/input.svelte';
	import { audio } from '$lib/game/audio';
	import { messages } from '$lib/messages/en';
	import { game_state } from '$lib/game/state.svelte';
	import { fonts } from '$lib/game/fonts';
	import { fullscreen } from '$lib/game/fullscreen.svelte';

	const CLICK_HINT_BASE_FONT_SIZE_REM = 1;

	let container: HTMLElement;
	let is_locked = $derived(input.is_pointer_locked);
	let is_cyber = $derived(game_state.is_cyber);
	let is_pseudo_fullscreen = $derived(fullscreen.is_pseudo_fullscreen);
	let click_hint_font_family = $derived(fonts.get_font_family(is_cyber));
	let click_hint_font_size_rem = $derived(
		CLICK_HINT_BASE_FONT_SIZE_REM * fonts.get_font_size_multiplier(is_cyber)
	);

	function request_lock(): void {
		audio.init_audio();
		container?.querySelector('canvas')?.requestPointerLock();
		if (container) void fullscreen.request(container);
	}

	onMount(() => {
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
	bind:this={container}
	onclick={request_lock}
	data-testid="game-scene"
>
	{#if !is_locked}
		<div
			class="click-hint"
			aria-live="polite"
			style:font-family={click_hint_font_family}
			style:font-size="{click_hint_font_size_rem}rem"
		>
			{messages.click_to_play}
		</div>
	{/if}
	<div
		class="crosshair"
		aria-hidden="true"
		data-testid="crosshair"
		style:display={is_locked ? '' : 'none'}
	></div>
	{#if is_cyber}
		<div class="cyber-glow" data-testid="cyber-glow" aria-hidden="true"></div>
	{/if}
	<Canvas shadows>
		<GameSceneObjects />
	</Canvas>
	<VirtualJoystick />
</div>

<style>
	.game-container {
		position: relative;
		width: 100%;
		height: 100vh;
		background: #0d0d12;
		cursor: crosshair;
	}

	.game-container.pseudo-fullscreen {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
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

	.crosshair {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 16px;
		height: 16px;
		pointer-events: none;
		z-index: 10;
	}

	.crosshair::before,
	.crosshair::after {
		content: '';
		position: absolute;
		background: rgba(255, 255, 255, 0.8);
	}

	.crosshair::before {
		width: 100%;
		height: 2px;
		top: 50%;
		transform: translateY(-50%);
	}

	.crosshair::after {
		width: 2px;
		height: 100%;
		left: 50%;
		transform: translateX(-50%);
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
