import { session } from '$lib/game/session.svelte';
import { switch_audio } from '$lib/game/switch-audio';

type CyberSwitchCallbacks = {
	on_toggle: () => void;
};

let cyber_callbacks: CyberSwitchCallbacks = { on_toggle: () => {} };

function configure(cbs: CyberSwitchCallbacks): void {
	cyber_callbacks = cbs;
}

function on_click(): void {
	if (!session.is_session_started) return;
	switch_audio.play_switch_click();
	cyber_callbacks.on_toggle();
}

export const cyber_switch_input = { configure, on_click };
