import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loading, create_loading } from '$lib/game/loading.svelte';
import { messages } from '$lib/messages/en';

const HALF_MIN_DISPLAY_MS = loading.MIN_DISPLAY_MS / 2;
const ONE_MS_BEFORE_HIDE = loading.MIN_DISPLAY_MS - 1;
const FIVE_SECONDS_MS = 5000;
const SAMPLE_PROGRESS_TEXT = '47%';
const SAMPLE_PROGRESS_VALUE = 47;
const INITIAL_PROGRESS_VALUE = 0;
const READY_PROGRESS_VALUE = 100;

describe('OBSERVER_GLOBAL_KEY', () => {
	it("equals '__loading_observer' to match the key used in app.html's inline script", () => {
		expect(loading.OBSERVER_GLOBAL_KEY).toBe('__loading_observer');
	});
});

describe('loading', () => {
	let overlay_element: HTMLElement;
	let status_element: HTMLSpanElement;
	let progress_element: HTMLSpanElement;
	let bar_element: HTMLProgressElement;
	let observer_disconnect: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.useFakeTimers();
		loading.configure({
			downloading: messages.loading_downloading,
			initializing: messages.loading_initializing,
			loading_assets: messages.loading_loading_assets,
			ready: messages.loading_ready
		});
		overlay_element = document.createElement('output');
		overlay_element.id = loading.OVERLAY_ELEMENT_ID;
		status_element = document.createElement('span');
		status_element.className = loading.STATUS_SELECTOR.replace('.', '');
		status_element.textContent = messages.loading_downloading;
		progress_element = document.createElement('span');
		progress_element.className = loading.PROGRESS_SELECTOR.replace('.', '');
		progress_element.textContent = loading.INITIAL_PROGRESS;
		bar_element = document.createElement('progress');
		bar_element.className = loading.PROGRESSBAR_SELECTOR.replace('.', '');
		bar_element.value = INITIAL_PROGRESS_VALUE;
		bar_element.max = READY_PROGRESS_VALUE;
		overlay_element.appendChild(status_element);
		overlay_element.appendChild(progress_element);
		overlay_element.appendChild(bar_element);
		document.body.appendChild(overlay_element);

		loading.reset();

		observer_disconnect = vi.fn();
		(globalThis as Record<string, unknown>)[loading.OBSERVER_GLOBAL_KEY] = {
			disconnect: observer_disconnect
		};
	});

	afterEach(() => {
		vi.useRealTimers();
		loading.reset();
		overlay_element.remove();
		(globalThis as Record<string, unknown>)[loading.OBSERVER_GLOBAL_KEY] = undefined;
	});

	it('starts with the downloading step, label, and initial progress', () => {
		expect(loading.is_visible).toBe(true);
		expect(loading.current_step).toBe('downloading');
		expect(status_element.textContent).toBe(messages.loading_downloading);
		expect(progress_element.textContent).toBe(loading.INITIAL_PROGRESS);
		expect(bar_element.value).toBe(INITIAL_PROGRESS_VALUE);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(false);
	});

	it('updates step and label when set_step("initializing") is called', () => {
		loading.set_step('initializing');
		expect(loading.current_step).toBe('initializing');
		expect(status_element.textContent).toBe(messages.loading_initializing);
	});

	it('updates step and label when set_step("loading_assets") is called', () => {
		loading.set_step('loading_assets');
		expect(loading.current_step).toBe('loading_assets');
		expect(status_element.textContent).toBe(messages.loading_loading_assets);
	});

	it('does not modify progress when set_step is called for non-ready steps', () => {
		bar_element.value = SAMPLE_PROGRESS_VALUE;
		progress_element.textContent = SAMPLE_PROGRESS_TEXT;
		loading.set_step('initializing');
		expect(bar_element.value).toBe(SAMPLE_PROGRESS_VALUE);
		expect(progress_element.textContent).toBe(SAMPLE_PROGRESS_TEXT);
	});

	it('disconnects the active observer on reset', () => {
		loading.reset();
		expect(observer_disconnect).toHaveBeenCalledTimes(1);
	});

	it('snaps progress to ready value, updates label, and disconnects the observer on mark_ready', () => {
		loading.mark_ready();
		expect(loading.current_step).toBe('ready');
		expect(status_element.textContent).toBe(messages.loading_ready);
		expect(progress_element.textContent).toBe(loading.READY_PROGRESS);
		expect(bar_element.value).toBe(READY_PROGRESS_VALUE);
		expect(observer_disconnect).toHaveBeenCalledTimes(1);
	});

	it('keeps overlay visible synchronously after mark_ready', () => {
		loading.mark_ready();
		expect(loading.is_visible).toBe(true);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(false);
	});

	it('keeps overlay visible until the minimum display elapses', () => {
		loading.mark_ready();
		vi.advanceTimersByTime(ONE_MS_BEFORE_HIDE);
		expect(loading.is_visible).toBe(true);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(false);
	});

	it('hides overlay once the minimum display elapses', () => {
		loading.mark_ready();
		vi.advanceTimersByTime(loading.MIN_DISPLAY_MS);
		expect(loading.is_visible).toBe(false);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(true);
	});

	it('does not double-schedule the hide timer or double-disconnect on repeat mark_ready calls', () => {
		loading.mark_ready();
		vi.advanceTimersByTime(HALF_MIN_DISPLAY_MS);
		loading.mark_ready();
		vi.advanceTimersByTime(HALF_MIN_DISPLAY_MS);
		expect(loading.is_visible).toBe(false);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(true);
		expect(observer_disconnect).toHaveBeenCalledTimes(1);
	});

	it('reset restores the initial step, label, progress, visibility, and clears any pending timer', () => {
		loading.mark_ready();
		vi.advanceTimersByTime(loading.MIN_DISPLAY_MS);
		expect(progress_element.textContent).toBe(loading.READY_PROGRESS);

		loading.reset();
		expect(loading.is_visible).toBe(true);
		expect(loading.current_step).toBe('downloading');
		expect(status_element.textContent).toBe(messages.loading_downloading);
		expect(progress_element.textContent).toBe(loading.INITIAL_PROGRESS);
		expect(bar_element.value).toBe(INITIAL_PROGRESS_VALUE);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(false);

		loading.mark_ready();
		loading.reset();
		vi.advanceTimersByTime(FIVE_SECONDS_MS);
		expect(loading.is_visible).toBe(true);
		expect(overlay_element.classList.contains(loading.OVERLAY_HIDDEN_CLASS)).toBe(false);
	});
});

describe('create_loading isolation', () => {
	it('two instances do not share is_visible state', () => {
		vi.useFakeTimers();
		const a = create_loading();
		const b = create_loading();
		a.mark_ready();
		vi.advanceTimersByTime(loading.MIN_DISPLAY_MS);
		expect(a.is_visible).toBe(false);
		expect(b.is_visible).toBe(true);
		vi.useRealTimers();
	});

	it('two instances do not share current_step state', () => {
		const a = create_loading();
		const b = create_loading();
		a.configure({ downloading: 'd', initializing: 'i', loading_assets: 'l', ready: 'r' });
		b.configure({ downloading: 'd', initializing: 'i', loading_assets: 'l', ready: 'r' });
		a.set_step('initializing');
		expect(a.current_step).toBe('initializing');
		expect(b.current_step).toBe('downloading');
	});
});
