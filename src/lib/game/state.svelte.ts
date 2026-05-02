const DEFAULT_IS_ALT = true;
let is_alt = $state(DEFAULT_IS_ALT);

function return_to_title(): void {
	is_alt = DEFAULT_IS_ALT;
}

function toggle_alt(): void {
	is_alt = !is_alt;
}

export const game_state = {
	get is_alt() {
		return is_alt;
	},
	return_to_title,
	toggle_alt
};
