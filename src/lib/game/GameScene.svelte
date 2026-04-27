<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import GameSceneObjects from './GameSceneObjects.svelte';
	import VirtualJoystick from './VirtualJoystick.svelte';
	import { input } from '$lib/game/input.svelte';
	import { audio } from '$lib/game/audio';
	import { messages } from '$lib/messages/en';

	let container: HTMLElement;
	let is_locked = $derived(input.is_pointer_locked);

	function request_lock(): void {
		audio.init_audio();
		container?.querySelector('canvas')?.requestPointerLock();
	}

	onMount(() => input.setup_listeners());
</script>

<div class="game-container" bind:this={container} onclick={request_lock} data-testid="game-scene">
	{#if !is_locked}
		<div class="click-hint" aria-live="polite">{messages.click_to_play}</div>
	{/if}
	<div class="crosshair" aria-hidden="true" data-testid="crosshair"></div>
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
</style>
