import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { simon } from '$lib/simon/simon.svelte';
import { simon_audio } from '$lib/simon/audio';
import type { ButtonColor } from '$lib/simon/types';

const ALL_COLORS: ButtonColor[] = ['green', 'red', 'yellow', 'blue'];
const STEP_MS = 500;
const ON_RATIO = 0.7;
const OFF_RATIO = 0.3;
const PRESS_FEEDBACK_MS = 200;
const RESTART_DELAY_MS = 1000;
const ON_MS = STEP_MS * ON_RATIO;
const OFF_MS = STEP_MS * OFF_RATIO;

function wrong_color(color: ButtonColor): ButtonColor {
	return ALL_COLORS.find((c) => c !== color) ?? 'red';
}

function seq_at(i: number): ButtonColor {
	const color = simon.sequence[i];
	if (!color) throw new Error(`sequence index ${String(i)} out of range`);
	return color;
}

describe('simon FSM', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		simon.reset();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
		simon.reset();
	});

	it('starts in idle phase with empty sequence and round 0', () => {
		expect(simon.phase).toBe('idle');
		expect(simon.sequence).toHaveLength(0);
		expect(simon.round).toBe(0);
		expect(simon.active_color).toBeNull();
		expect(simon.pressed_color).toBeNull();
	});

	it('start() transitions to showing, sets round 1, adds one sequence item', () => {
		simon.start();
		expect(simon.phase).toBe('showing');
		expect(simon.round).toBe(1);
		expect(simon.sequence).toHaveLength(1);
	});

	it('start() sets active_color to first sequence item immediately', () => {
		simon.start();
		expect(simon.active_color).toBe(seq_at(0));
	});

	it('showing phase transitions to player_input after timers complete', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		expect(simon.phase).toBe('player_input');
		expect(simon.position).toBe(0);
		expect(simon.active_color).toBeNull();
	});

	it('active_color clears after on_ms and phase becomes player_input after off_ms', async () => {
		simon.start();
		expect(simon.active_color).toBe(seq_at(0));
		await vi.advanceTimersByTimeAsync(ON_MS);
		expect(simon.active_color).toBeNull();
		await vi.advanceTimersByTimeAsync(OFF_MS);
		expect(simon.phase).toBe('player_input');
	});

	it('correct final press blocks further input immediately', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		expect(simon.phase).toBe('showing');
		expect(simon.round).toBe(1);
	});

	it('next round starts after 1 second delay following final correct press', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		await vi.advanceTimersByTimeAsync(RESTART_DELAY_MS);
		expect(simon.round).toBe(2);
		expect(simon.sequence).toHaveLength(2);
	});

	it('reset() cancels restart timer so next round does not start', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		simon.reset();
		await vi.advanceTimersByTimeAsync(RESTART_DELAY_MS);
		expect(simon.phase).toBe('idle');
		expect(simon.round).toBe(0);
	});

	it('correct intermediate press advances position without completing round', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0)); // complete round 1
		await vi.runAllTimersAsync(); // drain round 2 show
		const first_color = seq_at(0);
		simon.press(first_color); // first of two correct presses
		expect(simon.position).toBe(1);
		expect(simon.phase).toBe('player_input');
		expect(simon.round).toBe(2);
	});

	it('wrong press in normal mode replays sequence then returns to player_input', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(wrong_color(seq_at(0)));
		expect(simon.phase).toBe('showing');
		await vi.runAllTimersAsync();
		expect(simon.phase).toBe('player_input');
		expect(simon.position).toBe(0);
	});

	it('wrong press in strict mode triggers gameover', async () => {
		simon.toggle_mode();
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(wrong_color(seq_at(0)));
		expect(simon.phase).toBe('gameover');
	});

	it('press() is ignored when not in player_input phase', () => {
		simon.start(); // phase = showing
		simon.press('green');
		expect(simon.phase).toBe('showing');
	});

	it('pressed_color is set on press and clears after feedback duration', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		const color = seq_at(0);
		simon.press(color);
		expect(simon.pressed_color).toBe(color);
		await vi.advanceTimersByTimeAsync(PRESS_FEEDBACK_MS);
		expect(simon.pressed_color).toBeNull();
	});

	it('reset() returns all state to initial values', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.reset();
		expect(simon.phase).toBe('idle');
		expect(simon.mode).toBe('normal');
		expect(simon.sequence).toHaveLength(0);
		expect(simon.position).toBe(0);
		expect(simon.active_color).toBeNull();
		expect(simon.pressed_color).toBeNull();
		expect(simon.round).toBe(0);
	});

	it('reset() cancels press feedback timer to prevent stale clear', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		const wrong = wrong_color(seq_at(0));
		simon.press(wrong);
		expect(simon.pressed_color).toBe(wrong);
		simon.reset();
		expect(simon.pressed_color).toBeNull();
		await vi.advanceTimersByTimeAsync(PRESS_FEEDBACK_MS + 10);
		expect(simon.phase).toBe('idle');
	});

	it('reset() cancels an in-progress sequence display', async () => {
		simon.start();
		simon.reset();
		await vi.runAllTimersAsync();
		expect(simon.phase).toBe('idle');
	});

	it('toggle_mode() switches from normal to strict', () => {
		expect(simon.mode).toBe('normal');
		simon.toggle_mode();
		expect(simon.mode).toBe('strict');
	});

	it('toggle_mode() switches from strict back to normal', () => {
		simon.toggle_mode();
		simon.toggle_mode();
		expect(simon.mode).toBe('normal');
	});

	it('start() from gameover restarts the game in the same mode', async () => {
		simon.toggle_mode();
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(wrong_color(seq_at(0)));
		expect(simon.phase).toBe('gameover');
		simon.start();
		expect(simon.phase).toBe('showing');
		expect(simon.round).toBe(1);
		expect(simon.mode).toBe('strict');
	});

	it('start() is ignored while showing', () => {
		simon.start();
		simon.start();
		expect(simon.round).toBe(1);
	});

	it('start() is ignored during player_input', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.start();
		expect(simon.phase).toBe('player_input');
	});

	it('press() plays tone with pressed color and PRESS_FEEDBACK_MS duration', async () => {
		const spy = vi.spyOn(simon_audio, 'play_tone');
		simon.start();
		await vi.runAllTimersAsync();
		const color = seq_at(0);
		simon.press(color);
		expect(spy).toHaveBeenCalledWith(color, PRESS_FEEDBACK_MS);
	});

	it('press() does not play tone when not in player_input phase', () => {
		simon.start(); // phase = showing
		const spy = vi.spyOn(simon_audio, 'play_tone');
		simon.press('green');
		expect(spy).not.toHaveBeenCalled();
	});
});
