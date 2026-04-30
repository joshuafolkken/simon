import { game_state } from '$lib/game/state.svelte';
import { session } from '$lib/game/session.svelte';
import { switch_audio } from '$lib/game/switch-audio';

function on_click(): void {
	if (!session.is_session_started) return;
	switch_audio.play_switch_click();
	game_state.toggle_cyber();
}

export const cyber_switch_input = { on_click };
