const MIN_DISPLAY_MS = 3000;
const OVERLAY_ELEMENT_ID = 'static-loading-overlay';
const OVERLAY_HIDDEN_CLASS = 'is-hidden';
const STATUS_SELECTOR = '.status';
const PROGRESS_SELECTOR = '.progress';
const PROGRESS_CSS_VARIABLE = '--progress';
const READY_PROGRESS = '100%';
const INITIAL_PROGRESS = '0%';
const OBSERVER_GLOBAL_KEY: unique symbol = Symbol('loading_observer');

type LoadingStep = 'downloading' | 'initializing' | 'loading_assets' | 'ready';

export type StepMessages = Record<LoadingStep, string>;

interface LoadingObserver {
	disconnect(): void;
}

let step_messages: StepMessages = {
	downloading: '',
	initializing: '',
	loading_assets: '',
	ready: ''
};
let is_visible = $state(true);
let current_step = $state<LoadingStep>('downloading');
let hide_timer_id: ReturnType<typeof setTimeout> | null = null;

function configure(messages: StepMessages): void {
	step_messages = messages;
}

function get_overlay_element(): HTMLElement | null {
	if (typeof document === 'undefined') return null;
	return document.getElementById(OVERLAY_ELEMENT_ID);
}

function update_status_text(text: string): void {
	const overlay = get_overlay_element();
	if (!overlay) return;
	const status = overlay.querySelector<HTMLElement>(STATUS_SELECTOR);
	if (status) status.textContent = text;
}

function set_progress(value: string): void {
	const overlay = get_overlay_element();
	if (!overlay) return;
	overlay.style.setProperty(PROGRESS_CSS_VARIABLE, value);
	const progress = overlay.querySelector<HTMLElement>(PROGRESS_SELECTOR);
	if (progress) progress.textContent = value;
}

function disconnect_observer(): void {
	const scope = globalThis as Record<symbol, unknown>;
	const observer = scope[OBSERVER_GLOBAL_KEY] as LoadingObserver | undefined;
	if (observer && typeof observer.disconnect === 'function') {
		observer.disconnect();
		scope[OBSERVER_GLOBAL_KEY] = undefined;
	}
}

function hide_overlay_element(): void {
	const el = get_overlay_element();
	if (el) el.classList.add(OVERLAY_HIDDEN_CLASS);
}

function show_overlay_element(): void {
	const el = get_overlay_element();
	if (el) el.classList.remove(OVERLAY_HIDDEN_CLASS);
}

function set_step(step: LoadingStep): void {
	current_step = step;
	update_status_text(step_messages[step]);
}

function mark_ready(): void {
	if (hide_timer_id !== null) return;
	disconnect_observer();
	set_step('ready');
	set_progress(READY_PROGRESS);
	hide_timer_id = setTimeout(function on_min_display_elapsed(): void {
		is_visible = false;
		hide_overlay_element();
		hide_timer_id = null;
	}, MIN_DISPLAY_MS);
}

function reset(): void {
	if (hide_timer_id !== null) {
		clearTimeout(hide_timer_id);
		hide_timer_id = null;
	}
	disconnect_observer();
	is_visible = true;
	show_overlay_element();
	set_step('downloading');
	set_progress(INITIAL_PROGRESS);
}

export const loading = {
	get is_visible() {
		return is_visible;
	},
	get current_step() {
		return current_step;
	},
	configure,
	set_step,
	mark_ready,
	reset,
	MIN_DISPLAY_MS,
	OVERLAY_ELEMENT_ID,
	OVERLAY_HIDDEN_CLASS,
	STATUS_SELECTOR,
	PROGRESS_SELECTOR,
	PROGRESS_CSS_VARIABLE,
	OBSERVER_GLOBAL_KEY,
	READY_PROGRESS,
	INITIAL_PROGRESS
};
