<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import GameSceneObjects from './GameSceneObjects.svelte';
	import VirtualJoystick from './VirtualJoystick.svelte';
	import { input } from '$lib/game/input.svelte';
	import { messages } from '$lib/messages/en';

	let container: HTMLElement;
	let is_locked = $derived(input.is_pointer_locked);

	function request_lock(): void {
		container?.requestPointerLock();
	}

	onMount(() => input.setup_listeners());
</script>

<div class="game-container" bind:this={container} onclick={request_lock} data-testid="game-scene">
	{#if !is_locked}
		<div class="click-hint" aria-live="polite">{messages.click_to_play}</div>
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
</style>
