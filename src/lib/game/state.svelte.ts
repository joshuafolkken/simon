type GameScene = 'title' | 'playing';

let current_scene = $state<GameScene>('title');

function start_game(): void {
	current_scene = 'playing';
}

function return_to_title(): void {
	current_scene = 'title';
}

export const game_state = {
	get current_scene() {
		return current_scene;
	},
	start_game,
	return_to_title
};
