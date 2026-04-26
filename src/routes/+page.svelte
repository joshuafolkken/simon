<script lang="ts">
	import TitleScene from '$lib/title/TitleScene.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { messages } from '$lib/messages/en';
</script>

{#if game_state.current_scene === 'title'}
	<TitleScene />
{:else}
	<div data-testid="game-scene" class="game-placeholder">
		{messages.game_scene_placeholder}
	</div>
{/if}

<style>
	.game-placeholder {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0a0a1a;
		color: #ffffff;
		font-size: 2rem;
	}
</style>
