import { simon_audio } from './audio';
import type { ButtonColor, SimonPhase } from './types';

const COLORS: readonly ButtonColor[] = ['green', 'red', 'yellow', 'blue'];
const STEP_MS_1_5 = 500;
const STEP_MS_6_13 = 400;
const STEP_MS_14_20 = 250;
const STEP_MS_21_PLUS = 150;
const ON_RATIO = 0.7;
const OFF_RATIO = 0.3;
const TONE_MS = 200;
const RESTART_DELAY_MS = 1000;

let phase = $state<SimonPhase>('idle');
let sequence = $state<ButtonColor[]>([]);
let position = $state(0);
let active_color = $state<ButtonColor | null>(null);
let pressed_color = $state<ButtonColor | null>(null);
let round = $state(0);
let show_gen = 0;
let restart_timer: ReturnType<typeof setTimeout> | null = null;

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
	const color = COLORS[index];
	if (!color) return;
	sequence.push(color);
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
	phase = 'player_input';
	position = 0;
}

function cancel_restart_timer(): void {
	if (restart_timer !== null) clearTimeout(restart_timer);
	restart_timer = null;
}

function start_next_round(): void {
	restart_timer = null;
	round += 1;
	add_to_sequence();
	show_gen += 1;
	void run_show(show_gen);
}

function schedule_next_round(): void {
	cancel_restart_timer();
	phase = 'showing';
	restart_timer = setTimeout(start_next_round, RESTART_DELAY_MS);
}

function handle_correct_press(): void {
	position += 1;
	if (position < sequence.length) return;
	schedule_next_round();
}

function handle_wrong_press(): void {
	phase = 'gameover';
}

function start(): void {
	if (phase === 'showing') return;
	if (phase === 'player_input') return;
	phase = 'showing';
	round = 1;
	sequence = [];
	add_to_sequence();
	show_gen += 1;
	void run_show(show_gen);
}

function release(): void {
	pressed_color = null;
}

function press(color: ButtonColor): void {
	if (phase !== 'player_input') return;
	pressed_color = color;
	simon_audio.play_tone(color, TONE_MS);
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
	phase = 'idle';
	sequence = [];
	position = 0;
	active_color = null;
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
	start,
	press,
	release,
	reset
};
