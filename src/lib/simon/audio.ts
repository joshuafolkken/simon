import { audio as game_audio } from '$lib/game/audio';
import type { ButtonColor } from './types';

const FREQ: Record<ButtonColor, number> = {
	green: 415,
	red: 310,
	yellow: 252,
	blue: 209
};

const MS_PER_SECOND = 1000;
const GAIN_VALUE = 0.5;
const GAIN_FLOOR = 0.001;

function play_tone(color: ButtonColor, duration_ms: number): void {
	game_audio.init_audio();
	const ctx = game_audio.get_audio_context();
	if (!ctx) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.frequency.setValueAtTime(FREQ[color], ctx.currentTime);
	osc.type = 'sine';
	const duration_s = duration_ms / MS_PER_SECOND;
	gain.gain.setValueAtTime(GAIN_VALUE, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(GAIN_FLOOR, ctx.currentTime + duration_s);
	osc.start(ctx.currentTime);
	osc.stop(ctx.currentTime + duration_s);
}

export const simon_audio = { play_tone };
