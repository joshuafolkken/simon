import { CREDITS_SCROLL_SPEED } from './credits-config';

export function advance_scroll(
	current_z: number,
	delta: number,
	start_z: number,
	end_z: number
): number {
	const next_z = current_z - CREDITS_SCROLL_SPEED * delta;
	return next_z < end_z ? start_z : next_z;
}
