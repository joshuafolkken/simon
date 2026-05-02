const BASE_SCORE = 1_000;
const TIME_COEFF_DECAY = 0.1;
const MIN_TIME_COEFF = 0.1;
const HIGH_SCORE_STORAGE_KEY = 'simon_high_score';
const HIGH_SCORE_ROUND_KEY = 'simon_high_score_round';
const HIGH_SCORE_CHECK_KEY = 'simon_high_score_check';
const CHECK_SEED = 0x9e3779b9;
const SCORE_FORMATTER = new Intl.NumberFormat('en-US');

function compute_check(value: number, round: number): number {
	return (Math.imul(value + 1, CHECK_SEED) ^ Math.imul(round + 1, CHECK_SEED >>> 1)) >>> 0;
}

function load_stored_data(): { score: number; round: number } {
	try {
		const stored_score = Number(localStorage.getItem(HIGH_SCORE_STORAGE_KEY));
		const stored_round = Number(localStorage.getItem(HIGH_SCORE_ROUND_KEY));
		const stored_check = Number(localStorage.getItem(HIGH_SCORE_CHECK_KEY));
		const is_valid_score = Number.isFinite(stored_score) && stored_score > 0;
		const is_valid_round = Number.isFinite(stored_round) && stored_round >= 0;
		const is_check_ok = compute_check(stored_score, stored_round) === stored_check;
		if (!is_valid_score || !is_valid_round || !is_check_ok) return { score: 0, round: 0 };
		return { score: stored_score, round: stored_round };
	} catch {
		return { score: 0, round: 0 };
	}
}

function save_high_score(value: number, round: number): void {
	try {
		localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(value));
		localStorage.setItem(HIGH_SCORE_ROUND_KEY, String(round));
		localStorage.setItem(HIGH_SCORE_CHECK_KEY, String(compute_check(value, round)));
	} catch {
		// storage not available in this environment
	}
}

export function calculate_time_coefficient(elapsed_ms: number, sequence_length: number): number {
	const avg_s = elapsed_ms / 1000 / sequence_length;
	return Math.max(MIN_TIME_COEFF, 1 - avg_s * TIME_COEFF_DECAY);
}

export function calculate_round_score(
	elapsed_ms: number,
	sequence_length: number,
	round: number
): number {
	return Math.round(BASE_SCORE * calculate_time_coefficient(elapsed_ms, sequence_length) * round);
}

export function format_score(value: number): string {
	return SCORE_FORMATTER.format(value);
}

type ScoreState = {
	current_score: number;
	high_score: number;
	high_score_round: number;
	is_new_high_score: boolean;
	last_cleared_round: number;
};

function maybe_update_high_score(s: ScoreState, round: number): void {
	if (s.current_score <= s.high_score) return;
	s.high_score = s.current_score;
	s.high_score_round = round;
	s.is_new_high_score = true;
	save_high_score(s.high_score, round);
}

function add_round_score_impl(
	s: ScoreState,
	elapsed_ms: number,
	sequence_length: number,
	round: number
): void {
	s.current_score += calculate_round_score(elapsed_ms, sequence_length, round);
	s.last_cleared_round = round;
	maybe_update_high_score(s, round);
}

function reset_score_impl(s: ScoreState): void {
	s.current_score = 0;
	s.is_new_high_score = false;
	s.last_cleared_round = 0;
}

function make_score_api(s: ScoreState) {
	return {
		get current_score(): number {
			return s.current_score;
		},
		get high_score(): number {
			return s.high_score;
		},
		get high_score_round(): number {
			return s.high_score_round;
		},
		get is_new_high_score(): boolean {
			return s.is_new_high_score;
		},
		get last_cleared_round(): number {
			return s.last_cleared_round;
		},
		add_round_score: (elapsed_ms: number, sequence_length: number, round: number): void =>
			add_round_score_impl(s, elapsed_ms, sequence_length, round),
		reset: (): void => reset_score_impl(s),
		format_score,
		calculate_time_coefficient,
		calculate_round_score,
		compute_check,
		load_stored_data
	};
}

export function create_score() {
	const loaded = load_stored_data();
	const s = $state<ScoreState>({
		current_score: 0,
		high_score: loaded.score,
		high_score_round: loaded.round,
		is_new_high_score: false,
		last_cleared_round: 0
	});
	return make_score_api(s);
}

export type ScoreInstance = ReturnType<typeof create_score>;

export const score = create_score();
