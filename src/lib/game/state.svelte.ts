const DEFAULT_IS_CYBER = true;
let is_cyber = $state(DEFAULT_IS_CYBER);

function return_to_title(): void {
	is_cyber = DEFAULT_IS_CYBER;
}

function toggle_cyber(): void {
	is_cyber = !is_cyber;
}

export const game_state = {
	get is_cyber() {
		return is_cyber;
	},
	return_to_title,
	toggle_cyber
};
