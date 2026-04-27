import { describe, it, expect, afterEach, vi } from 'vitest';
import { simon_audio } from '$lib/simon/audio';
import { audio as game_audio } from '$lib/game/audio';
import { game_state } from '$lib/game/state.svelte';
import type { ButtonColor } from '$lib/simon/types';

const ALL_COLORS: ButtonColor[] = ['green', 'red', 'yellow', 'blue'];

function make_mock_ctx() {
	const gain_node = {
		gain: {
			setValueAtTime: vi.fn(),
			exponentialRampToValueAtTime: vi.fn()
		},
		connect: vi.fn()
	};
	const osc_node = {
		connect: vi.fn(),
		frequency: { setValueAtTime: vi.fn() },
		type: '' as OscillatorType,
		start: vi.fn(),
		stop: vi.fn()
	};
	const ctx = {
		createOscillator: vi.fn().mockReturnValue(osc_node),
		createGain: vi.fn().mockReturnValue(gain_node),
		destination: {},
		currentTime: 0
	};
	return { ctx, gain_node, osc_node };
}

describe('simon audio', () => {
	it.each(ALL_COLORS)('play_tone does not throw for %s', (color) => {
		expect(() => simon_audio.play_tone(color, 100)).not.toThrow();
	});

	it('play_error_tone does not throw', () => {
		expect(() => simon_audio.play_error_tone(100)).not.toThrow();
	});

	it.each(ALL_COLORS)('start_tone does not throw for %s', (color) => {
		expect(() => simon_audio.start_tone(color)).not.toThrow();
	});

	it('stop_tone does not throw when no tone is playing', () => {
		expect(() => simon_audio.stop_tone()).not.toThrow();
	});
});

describe('simon audio cyber mode', () => {
	afterEach(() => {
		game_state.return_to_title();
	});

	it.each(ALL_COLORS)('play_tone does not throw for %s in cyber mode', (color) => {
		expect(() => simon_audio.play_tone(color, 100)).not.toThrow();
	});
});

describe('simon audio envelope', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		game_state.return_to_title();
	});

	it('normal mode uses flat envelope — no exponential ramp', () => {
		game_state.toggle_cyber();
		const { ctx, gain_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.play_tone('green', 200);

		expect(gain_node.gain.setValueAtTime).toHaveBeenCalled();
		expect(gain_node.gain.exponentialRampToValueAtTime).not.toHaveBeenCalled();
	});

	it('cyber mode applies exponential gain ramp', () => {
		const { ctx, gain_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.play_tone('green', 200);

		expect(gain_node.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
	});

	it('play_error_tone uses ERROR_FREQ', () => {
		const { ctx, osc_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.play_error_tone(3000);

		expect(osc_node.frequency.setValueAtTime).toHaveBeenCalledWith(simon_audio.ERROR_FREQ, 0);
	});

	it('start_tone starts oscillator without calling stop', () => {
		const { ctx, osc_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.start_tone('green');

		expect(osc_node.start).toHaveBeenCalled();
		expect(osc_node.stop).not.toHaveBeenCalled();
	});

	it('stop_tone calls stop on the active oscillator', () => {
		const { ctx, osc_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.start_tone('red');
		simon_audio.stop_tone();

		expect(osc_node.stop).toHaveBeenCalledTimes(1);
	});

	it('play_error_tone normal mode uses flat envelope', () => {
		game_state.toggle_cyber();
		const { ctx, gain_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.play_error_tone(3000);

		expect(gain_node.gain.setValueAtTime).toHaveBeenCalled();
		expect(gain_node.gain.exponentialRampToValueAtTime).not.toHaveBeenCalled();
	});

	it('play_error_tone cyber mode applies exponential gain ramp', () => {
		const { ctx, gain_node } = make_mock_ctx();
		vi.spyOn(game_audio, 'init_audio').mockImplementation(() => {});
		vi.spyOn(game_audio, 'get_audio_context').mockReturnValue(ctx as unknown as AudioContext);

		simon_audio.play_error_tone(3000);

		expect(gain_node.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
	});
});
