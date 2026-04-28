import { game_state } from '$lib/game/state.svelte';
import { session } from '$lib/game/session.svelte';

function on_click(): void {
	if (!session.is_session_started) return;
	game_state.toggle_cyber();
}

export const cyber_switch_input = { on_click };
