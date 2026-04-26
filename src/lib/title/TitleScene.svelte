<script lang="ts">
	import { Canvas } from '@threlte/core';
	import TitleSceneObjects from './TitleSceneObjects.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { audio } from '$lib/game/audio';

	function handle_start(): void {
		audio.init_audio();
		game_state.start_game();
	}

	function handle_keydown(e: KeyboardEvent): void {
		if (e.key === 'Enter' || e.key === ' ') handle_start();
	}
</script>

<div
	class="title-container"
	role="button"
	tabindex="0"
	aria-label="Click or press Enter to start the Simon game"
	onclick={handle_start}
	onkeydown={handle_keydown}
>
	<Canvas>
		<TitleSceneObjects />
	</Canvas>
</div>

<style>
	.title-container {
		position: relative;
		width: 100%;
		height: 100vh;
		background: #0a0a1a;
		cursor: pointer;
	}
</style>
