const MOVE_SPEED = 5;
const SPRINT_MULTIPLIER = 2;
const DASH_MULTIPLIER = 3;

function get_move_speed(is_sprinting: boolean, is_dashing: boolean): number {
	if (is_dashing) return MOVE_SPEED * DASH_MULTIPLIER;
	if (is_sprinting) return MOVE_SPEED * SPRINT_MULTIPLIER;
	return MOVE_SPEED;
}

export const player_speed = { get_move_speed, MOVE_SPEED, SPRINT_MULTIPLIER, DASH_MULTIPLIER };
