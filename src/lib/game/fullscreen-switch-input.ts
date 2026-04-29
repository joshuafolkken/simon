import { fullscreen } from '$lib/game/fullscreen.svelte';
import { session } from '$lib/game/session.svelte';

let container: HTMLElement | null = null;

function set_container(el: HTMLElement | null): void {
	container = el;
}

function on_click(): void {
	if (!session.is_session_started) return;
	if (!container) return;
	if (fullscreen.is_active) {
		void fullscreen.exit();
	} else {
		void fullscreen.request(container);
	}
}

export const fullscreen_switch_input = { set_container, on_click };
