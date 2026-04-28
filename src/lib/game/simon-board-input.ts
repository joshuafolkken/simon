import { simon } from '$lib/simon/simon.svelte';
import { session } from '$lib/game/session.svelte';
import { pointer_button } from '$lib/game/pointer-button';
import type { ButtonColor } from '$lib/simon/types';

function on_button_pointer_down(e: { nativeEvent: { button: number } }, color: ButtonColor): void {
	if (!session.is_session_started) return;
	if (!pointer_button.is_left_click(e)) return;
	simon.press(color);
}

function on_button_release(): void {
	if (!session.is_session_started) return;
	simon.release();
}

function on_center_click(): void {
	if (!session.is_session_started) return;
	simon.start();
}

export const simon_board_input = {
	on_button_pointer_down,
	on_button_release,
	on_center_click
};
