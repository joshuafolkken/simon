import { simon_audio } from './audio';
import { score } from './score.svelte';
import type { ButtonColor, SimonPhase } from './types';

const COLORS: readonly [ButtonColor, ButtonColor, ButtonColor, ButtonColor] = [
	'green',
	'red',
	'yellow',
	'blue'
];
export const STEP_MS_1_5 = 500;
export const STEP_MS_6_13 = 400;
export const STEP_MS_14_20 = 250;
export const STEP_MS_21_PLUS = 150;
export const ON_RATIO = 0.7;
export const OFF_RATIO = 0.3;
export const ERROR_BEEP_MS = 3000;
export const RESTART_DELAY_MS = 1000;
export const FLASH_BURST_ON_MS = 30;
export const FLASH_BURST_OFF_MS = 20;
export const FLASH_BURST_CYCLES = 4;
export const FLASH_CASCADE_FWD_MS = 65;
export const FLASH_CASCADE_REV_MS = 40;
export const FLASH_FINALE_MS = 320;

const FLASH_INTENSITY_BURST = 2.5;
const FLASH_INTENSITY_FINALE = 4;

let phase = $state<SimonPhase>('idle');
let sequence = $state<ButtonColor[]>([]);
let position = $state(0);
let active_color = $state<ButtonColor | null>(null);
let pressed_color = $state<ButtonColor | null>(null);
let round = $state(0);
let flash_colors = $state<ButtonColor[]>([]);
let flash_intensity = $state(1);
let show_gen = 0;
let flash_gen = 0;
let restart_timer: ReturnType<typeof setTimeout> | null = null;
let input_start_ms = 0;

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function get_step_ms(len: number): number {
	if (len <= 5) return STEP_MS_1_5;
	if (len <= 13) return STEP_MS_6_13;
	if (len <= 20) return STEP_MS_14_20;
	return STEP_MS_21_PLUS;
}

function add_to_sequence(): void {
	const index = Math.floor(Math.random() * COLORS.length);
	sequence.push(COLORS[index] ?? COLORS[0]);
}

async function run_show(gen: number): Promise<void> {
	const step_ms = get_step_ms(sequence.length);
	const on_ms = step_ms * ON_RATIO;
	const off_ms = step_ms * OFF_RATIO;
	for (const color of sequence) {
		if (gen !== show_gen) return;
		active_color = color;
		simon_audio.play_tone(color, on_ms);
		await delay(on_ms);
		if (gen !== show_gen) return;
		active_color = null;
		await delay(off_ms);
	}
	if (gen !== show_gen) return;
	input_start_ms = Date.now();
	phase = 'player_input';
	position = 0;
}

function cancel_restart_timer(): void {
	if (restart_timer !== null) clearTimeout(restart_timer);
	restart_timer = null;
}

function cancel_flash(): void {
	flash_gen += 1;
	flash_colors = [];
	flash_intensity = 1;
}

function play_all_tones(duration_ms: number): void {
	for (const color of COLORS) {
		simon_audio.play_tone(color, duration_ms);
	}
}

async function flash_burst(gen: number): Promise<void> {
	for (let i = 0; i < FLASH_BURST_CYCLES; i++) {
		if (flash_gen !== gen) return;
		flash_colors = [...COLORS];
		flash_intensity = FLASH_INTENSITY_BURST;
		play_all_tones(FLASH_BURST_ON_MS);
		await delay(FLASH_BURST_ON_MS);
		if (flash_gen !== gen) return;
		flash_colors = [];
		flash_intensity = 1;
		await delay(FLASH_BURST_OFF_MS);
	}
}

async function flash_cascade(gen: number): Promise<void> {
	for (const color of COLORS) {
		if (flash_gen !== gen) return;
		flash_colors = [color];
		flash_intensity = FLASH_INTENSITY_BURST;
		simon_audio.play_tone(color, FLASH_CASCADE_FWD_MS);
		await delay(FLASH_CASCADE_FWD_MS);
	}
	for (const color of [...COLORS].reverse()) {
		if (flash_gen !== gen) return;
		flash_colors = [color];
		flash_intensity = FLASH_INTENSITY_BURST;
		simon_audio.play_tone(color, FLASH_CASCADE_REV_MS);
		await delay(FLASH_CASCADE_REV_MS);
	}
}

async function flash_finale(gen: number): Promise<void> {
	if (flash_gen !== gen) return;
	flash_colors = [...COLORS];
	flash_intensity = FLASH_INTENSITY_FINALE;
	play_all_tones(FLASH_FINALE_MS);
	await delay(FLASH_FINALE_MS);
	if (flash_gen !== gen) return;
	flash_colors = [];
	flash_intensity = 1;
}

async function run_victory_flash(gen: number): Promise<void> {
	await flash_burst(gen);
	await flash_cascade(gen);
	await flash_finale(gen);
}

function start_next_round(): void {
	restart_timer = null;
	cancel_flash();
	round += 1;
	add_to_sequence();
	show_gen += 1;
	void run_show(show_gen);
}

function schedule_next_round(): void {
	cancel_restart_timer();
	cancel_flash();
	phase = 'showing';
	void run_victory_flash(flash_gen);
	restart_timer = setTimeout(start_next_round, RESTART_DELAY_MS);
}

function handle_correct_press(): void {
	position += 1;
	if (position < sequence.length) return;
	score.add_round_score(Date.now() - input_start_ms, sequence.length, round);
	phase = 'round_complete';
}

function handle_wrong_press(): void {
	simon_audio.play_error_tone(ERROR_BEEP_MS);
	phase = 'gameover';
}

function start(): void {
	if (phase === 'showing') return;
	if (phase === 'player_input') return;
	cancel_restart_timer();
	score.reset();
	phase = 'showing';
	round = 1;
	sequence = [];
	add_to_sequence();
	show_gen += 1;
	void run_show(show_gen);
}

function release(): void {
	simon_audio.stop_tone();
	pressed_color = null;
	if (phase === 'round_complete') schedule_next_round();
}

function press(color: ButtonColor): void {
	if (phase !== 'player_input') return;
	pressed_color = color;
	simon_audio.start_tone(color);
	if (color === sequence[position]) {
		handle_correct_press();
	} else {
		handle_wrong_press();
	}
}

function reset(): void {
	show_gen += 1;
	release();
	cancel_restart_timer();
	cancel_flash();
	score.reset();
	phase = 'idle';
	sequence = [];
	position = 0;
	active_color = null;
	input_start_ms = 0;
	round = 0;
}

export const simon = {
	get phase() {
		return phase;
	},
	get sequence() {
		return sequence;
	},
	get position() {
		return position;
	},
	get active_color() {
		return active_color;
	},
	get pressed_color() {
		return pressed_color;
	},
	get round() {
		return round;
	},
	get flash_colors() {
		return flash_colors;
	},
	get flash_intensity() {
		return flash_intensity;
	},
	start,
	press,
	release,
	reset
};
