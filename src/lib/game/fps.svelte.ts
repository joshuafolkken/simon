const INITIAL_FPS_TEXT = '---';

let is_fps_enabled = $state(true);
let current_fps_text = $state(INITIAL_FPS_TEXT);

function toggle(): void {
	is_fps_enabled = !is_fps_enabled;
	if (!is_fps_enabled) current_fps_text = INITIAL_FPS_TEXT;
}

function set_fps_text(text: string): void {
	current_fps_text = text;
}

export const fps = {
	get is_fps_enabled(): boolean {
		return is_fps_enabled;
	},
	get current_fps_text(): string {
		return current_fps_text;
	},
	toggle,
	set_fps_text
};
