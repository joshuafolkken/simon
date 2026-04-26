<script lang="ts">
	import TitleScene from '$lib/title/TitleScene.svelte';
	import GameScene from '$lib/game/GameScene.svelte';
	import { game_state } from '$lib/game/state.svelte';
</script>

{#if game_state.current_scene === 'title'}
	<TitleScene />
{:else}
	<GameScene />
{/if}
