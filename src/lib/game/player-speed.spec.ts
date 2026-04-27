import { describe, it, expect } from 'vitest';
import { player_speed } from './player-speed';

describe('player_speed', () => {
	it('dash multiplier is greater than sprint multiplier', () => {
		expect(player_speed.DASH_MULTIPLIER).toBeGreaterThan(player_speed.SPRINT_MULTIPLIER);
	});

	it('returns base speed when not sprinting or dashing', () => {
		expect(player_speed.get_move_speed(false, false)).toBe(player_speed.MOVE_SPEED);
	});

	it('returns sprint speed when sprinting', () => {
		expect(player_speed.get_move_speed(true, false)).toBe(
			player_speed.MOVE_SPEED * player_speed.SPRINT_MULTIPLIER
		);
	});

	it('returns dash speed when dashing', () => {
		expect(player_speed.get_move_speed(false, true)).toBe(
			player_speed.MOVE_SPEED * player_speed.DASH_MULTIPLIER
		);
	});

	it('dash takes priority over sprint', () => {
		expect(player_speed.get_move_speed(true, true)).toBe(
			player_speed.MOVE_SPEED * player_speed.DASH_MULTIPLIER
		);
	});
});
