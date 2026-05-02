import { session } from '$lib/game/session.svelte';
import { switch_audio } from '$lib/game/switch-audio';
import { fps } from '$lib/game/fps.svelte';

function on_click(): void {
	if (!session.is_session_started) return;
	switch_audio.play_switch_click();
	fps.toggle();
}

export const fps_switch_input = { on_click };
