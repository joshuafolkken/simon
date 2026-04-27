import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { simon } from '$lib/simon/simon.svelte';
import { simon_audio } from '$lib/simon/audio';
import type { ButtonColor } from '$lib/simon/types';

const ALL_COLORS: ButtonColor[] = ['green', 'red', 'yellow', 'blue'];
const STEP_MS = 500;
const ON_RATIO = 0.7;
const OFF_RATIO = 0.3;
const TONE_MS = 200;
const ERROR_BEEP_MS = 3000;
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

	it('correct final press transitions to round_complete and blocks further input', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		expect(simon.phase).toBe('round_complete');
		expect(simon.round).toBe(1);
	});

	it('next round does not start while last button is still held', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		await vi.advanceTimersByTimeAsync(RESTART_DELAY_MS * 2);
		expect(simon.phase).toBe('round_complete');
		expect(simon.round).toBe(1);
	});

	it('next round starts after 1 second delay following release of final button', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		simon.release();
		expect(simon.phase).toBe('showing');
		await vi.advanceTimersByTimeAsync(RESTART_DELAY_MS);
		expect(simon.round).toBe(2);
		expect(simon.sequence).toHaveLength(2);
	});

	it('press is ignored during round_complete phase', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		const spy = vi.spyOn(simon_audio, 'start_tone');
		simon.press('green');
		simon.press('red');
		expect(spy).not.toHaveBeenCalled();
		expect(simon.phase).toBe('round_complete');
	});

	it('reset() during round_complete cancels pending next round', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		simon.reset();
		await vi.advanceTimersByTimeAsync(RESTART_DELAY_MS);
		expect(simon.phase).toBe('idle');
		expect(simon.round).toBe(0);
	});

	it('reset() cancels restart timer so next round does not start', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		simon.release();
		simon.reset();
		await vi.advanceTimersByTimeAsync(RESTART_DELAY_MS);
		expect(simon.phase).toBe('idle');
		expect(simon.round).toBe(0);
	});

	it('correct intermediate press advances position without completing round', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0)); // complete round 1
		simon.release();
		await vi.runAllTimersAsync(); // drain round 2 show
		const first_color = seq_at(0);
		simon.press(first_color); // first of two correct presses
		expect(simon.position).toBe(1);
		expect(simon.phase).toBe('player_input');
		expect(simon.round).toBe(2);
	});

	it('wrong press triggers gameover', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(wrong_color(seq_at(0)));
		expect(simon.phase).toBe('gameover');
	});

	it('wrong press plays error tone for ERROR_BEEP_MS', async () => {
		const spy = vi.spyOn(simon_audio, 'play_error_tone');
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(wrong_color(seq_at(0)));
		expect(spy).toHaveBeenCalledWith(ERROR_BEEP_MS);
	});

	it('press() is ignored when not in player_input phase', () => {
		simon.start(); // phase = showing
		simon.press('green');
		expect(simon.phase).toBe('showing');
	});

	it('pressed_color is set on press and does not auto-clear', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		const color = seq_at(0);
		simon.press(color);
		expect(simon.pressed_color).toBe(color);
		await vi.advanceTimersByTimeAsync(TONE_MS + 10);
		expect(simon.pressed_color).toBe(color);
	});

	it('release() clears pressed_color', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		simon.release();
		expect(simon.pressed_color).toBeNull();
	});

	it('reset() returns all state to initial values', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.reset();
		expect(simon.phase).toBe('idle');
		expect(simon.sequence).toHaveLength(0);
		expect(simon.position).toBe(0);
		expect(simon.active_color).toBeNull();
		expect(simon.pressed_color).toBeNull();
		expect(simon.round).toBe(0);
	});

	it('reset() clears pressed_color immediately', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		const wrong = wrong_color(seq_at(0));
		simon.press(wrong);
		expect(simon.pressed_color).toBe(wrong);
		simon.reset();
		expect(simon.pressed_color).toBeNull();
	});

	it('reset() cancels an in-progress sequence display', async () => {
		simon.start();
		simon.reset();
		await vi.runAllTimersAsync();
		expect(simon.phase).toBe('idle');
	});

	it('start() from gameover restarts the game', async () => {
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(wrong_color(seq_at(0)));
		expect(simon.phase).toBe('gameover');
		simon.start();
		expect(simon.phase).toBe('showing');
		expect(simon.round).toBe(1);
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

	it('press() starts tone for pressed color', async () => {
		const spy = vi.spyOn(simon_audio, 'start_tone');
		simon.start();
		await vi.runAllTimersAsync();
		const color = seq_at(0);
		simon.press(color);
		expect(spy).toHaveBeenCalledWith(color);
	});

	it('press() does not start tone when not in player_input phase', () => {
		simon.start(); // phase = showing
		const spy = vi.spyOn(simon_audio, 'start_tone');
		simon.press('green');
		expect(spy).not.toHaveBeenCalled();
	});

	it('release() stops the tone', async () => {
		const spy = vi.spyOn(simon_audio, 'stop_tone');
		simon.start();
		await vi.runAllTimersAsync();
		simon.press(seq_at(0));
		simon.release();
		expect(spy).toHaveBeenCalled();
	});
});
