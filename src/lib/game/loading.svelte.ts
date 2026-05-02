export const MIN_DISPLAY_MS = 3000;
export const OVERLAY_ELEMENT_ID = 'static-loading-overlay';
export const OVERLAY_HIDDEN_CLASS = 'is-hidden';
export const STATUS_SELECTOR = '.status';
export const PROGRESS_SELECTOR = '.progress';
export const PROGRESSBAR_SELECTOR = '.bar';
export const READY_PROGRESS = '100%';
export const INITIAL_PROGRESS = '0%';
export const OBSERVER_GLOBAL_KEY = '__loading_observer';

type LoadingStep = 'downloading' | 'initializing' | 'loading_assets' | 'ready';

export type StepMessages = Record<LoadingStep, string>;

interface LoadingObserver {
	disconnect(): void;
}

type LoadingState = { is_visible: boolean; current_step: LoadingStep };
type LoadingRefs = { hide_timer_id: ReturnType<typeof setTimeout> | null };

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
	const progress = overlay.querySelector<HTMLElement>(PROGRESS_SELECTOR);
	if (progress) progress.textContent = value;
	const bar = overlay.querySelector<HTMLProgressElement>(PROGRESSBAR_SELECTOR);
	if (bar) bar.value = Number.parseInt(value, 10);
}

function disconnect_observer(): void {
	const scope = globalThis as Record<string, unknown>;
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

function set_step_impl(s: LoadingState, messages: StepMessages, step: LoadingStep): void {
	s.current_step = step;
	update_status_text(messages[step]);
}

function mark_ready_impl(s: LoadingState, refs: LoadingRefs, messages: StepMessages): void {
	if (refs.hide_timer_id !== null) return;
	disconnect_observer();
	set_step_impl(s, messages, 'ready');
	set_progress(READY_PROGRESS);
	refs.hide_timer_id = setTimeout(function on_min_display_elapsed(): void {
		s.is_visible = false;
		hide_overlay_element();
		refs.hide_timer_id = null;
	}, MIN_DISPLAY_MS);
}

function reset_impl(s: LoadingState, refs: LoadingRefs, messages: StepMessages): void {
	if (refs.hide_timer_id !== null) {
		clearTimeout(refs.hide_timer_id);
		refs.hide_timer_id = null;
	}
	disconnect_observer();
	s.is_visible = true;
	show_overlay_element();
	set_step_impl(s, messages, 'downloading');
	set_progress(INITIAL_PROGRESS);
}

const EMPTY_MESSAGES: StepMessages = {
	downloading: '',
	initializing: '',
	loading_assets: '',
	ready: ''
};

export function create_loading() {
	let step_messages: StepMessages = EMPTY_MESSAGES;
	const s = $state<LoadingState>({ is_visible: true, current_step: 'downloading' });
	const refs: LoadingRefs = { hide_timer_id: null };
	return {
		get is_visible() {
			return s.is_visible;
		},
		get current_step() {
			return s.current_step;
		},
		configure: (messages: StepMessages): void => {
			step_messages = messages;
		},
		set_step: (step: LoadingStep): void => set_step_impl(s, step_messages, step),
		mark_ready: (): void => mark_ready_impl(s, refs, step_messages),
		reset: (): void => reset_impl(s, refs, step_messages),
		MIN_DISPLAY_MS,
		OVERLAY_ELEMENT_ID,
		OVERLAY_HIDDEN_CLASS,
		STATUS_SELECTOR,
		PROGRESS_SELECTOR,
		PROGRESSBAR_SELECTOR,
		OBSERVER_GLOBAL_KEY,
		READY_PROGRESS,
		INITIAL_PROGRESS
	};
}

export type LoadingInstance = ReturnType<typeof create_loading>;

export const loading = create_loading();
