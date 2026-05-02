<script lang="ts">
	import SceneObjects from './SceneObjects.svelte';
	import SimonBoard from './SimonBoard.svelte';
	import { simon } from '$lib/simon/simon.svelte';
	import { score } from '$lib/simon/score.svelte';
	import { CREDITS_TEXT, CREDITS_SCROLL_START_Z, CREDITS_SCROLL_END_Z } from '$lib/simon/credits';

	let score_data = $derived({
		high_score: score.high_score,
		current_score: score.current_score,
		is_new_high_score: score.is_new_high_score,
		high_score_round: score.high_score_round,
		last_cleared_round: score.last_cleared_round,
		format_score: score.format_score
	});
	let simon_data = $derived({
		active_color: simon.active_color,
		pressed_color: simon.pressed_color,
		phase: simon.phase,
		round: simon.round,
		flash_colors: simon.flash_colors,
		flash_intensity: simon.flash_intensity
	});
</script>

<SceneObjects
	{score_data}
	game_phase={simon.phase}
	credits_text={CREDITS_TEXT}
	credits_start_z={CREDITS_SCROLL_START_Z}
	credits_end_z={CREDITS_SCROLL_END_Z}
>
	{#snippet game_board()}
		<SimonBoard {simon_data} />
	{/snippet}
</SceneObjects>
