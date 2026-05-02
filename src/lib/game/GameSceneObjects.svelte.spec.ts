import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import GameSceneObjects from './GameSceneObjects.svelte';

vi.mock('./SceneObjects.svelte', () => ({ default: function SceneObjects() {} }));
vi.mock('./SimonBoard.svelte', () => ({ default: function SimonBoard() {} }));
vi.mock('$lib/game/state.svelte', () => ({ game_state: { is_alt: false } }));
vi.mock('$lib/messages/en', () => ({
	messages: {
		game_title: 'SIMON',
		cyber_switch_label: 'CYBER',
		fullscreen_switch_label: 'FULLSCREEN',
		score_high_score: 'HI',
		score_round: 'RND',
		score_current: 'SCORE',
		simon_gameover: 'GAME OVER',
		simon_round: 'ROUND',
		simon_start: 'START'
	}
}));
vi.mock('$lib/simon/simon.svelte', () => ({
	simon: {
		active_color: null,
		pressed_color: null,
		phase: 'idle',
		round: 0,
		flash_colors: [],
		flash_intensity: 1
	}
}));
vi.mock('$lib/simon/score.svelte', () => ({
	score: {
		high_score: 0,
		current_score: 0,
		is_new_high_score: false,
		high_score_round: 0,
		last_cleared_round: 0,
		format_score: (v: number) => String(v)
	}
}));
vi.mock('$lib/simon/credits', () => ({
	CREDITS_TEXT: 'Credits',
	CREDITS_SCROLL_START_Z: 10,
	CREDITS_SCROLL_END_Z: -10
}));

describe('GameSceneObjects', () => {
	it('renders without error', () => {
		const { container } = render(GameSceneObjects);
		expect(container).toBeTruthy();
	});
});
