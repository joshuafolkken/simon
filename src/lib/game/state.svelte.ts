type GameScene = 'title' | 'playing';

let current_scene = $state<GameScene>('title');
let is_cyber = $state(false);

function start_game(): void {
	current_scene = 'playing';
}

function return_to_title(): void {
	current_scene = 'title';
	is_cyber = false;
}

function toggle_cyber(): void {
	is_cyber = !is_cyber;
}

export const game_state = {
	get current_scene() {
		return current_scene;
	},
	get is_cyber() {
		return is_cyber;
	},
	start_game,
	return_to_title,
	toggle_cyber
};
