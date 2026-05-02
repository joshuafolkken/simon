<script lang="ts">
	import GameScene from '$lib/game/GameScene.svelte';
	import GameSceneObjects from '$lib/game/GameSceneObjects.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { fonts } from '$lib/game/fonts';
	import { messages } from '$lib/messages/en';
	import { session } from '$lib/game/session.svelte';

	const CLICK_HINT_BASE_FONT_SIZE_REM = 1;

	let is_alt = $derived(game_state.is_alt);
	let hint_font_family = $derived(fonts.get_font_family(is_alt));
	let hint_font_size_rem = $derived(
		CLICK_HINT_BASE_FONT_SIZE_REM * fonts.get_font_size_multiplier(is_alt)
	);
</script>

<GameScene
	hint_text={messages.click_to_play}
	label_jump={messages.jump_button}
	{hint_font_family}
	{hint_font_size_rem}
	on_start={session.start_session}
>
	{#snippet overlay()}
		{#if is_alt}
			<div class="cyber-glow" data-testid="cyber-glow" aria-hidden="true"></div>
		{/if}
	{/snippet}
	<GameSceneObjects />
</GameScene>

<style>
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
