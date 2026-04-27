let is_cyber = $state(true);

function return_to_title(): void {
	is_cyber = true;
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
