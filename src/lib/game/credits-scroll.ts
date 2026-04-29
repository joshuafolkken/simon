import {
	CREDITS_SCROLL_SPEED,
	CREDITS_SCROLL_START_Z,
	CREDITS_SCROLL_END_Z
} from './credits-config';

export function advance_scroll(current_z: number, delta: number): number {
	const next_z = current_z - CREDITS_SCROLL_SPEED * delta;
	return next_z < CREDITS_SCROLL_END_Z ? CREDITS_SCROLL_START_Z : next_z;
}
