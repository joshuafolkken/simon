declare global {
	interface Element {
		webkitRequestFullscreen?: () => Promise<void> | void;
	}
	interface Document {
		webkitFullscreenElement?: Element | null;
		webkitExitFullscreen?: () => Promise<void> | void;
	}
}

type FullscreenState = { is_pseudo_fullscreen: boolean; is_native_fullscreen: boolean };
type FullscreenRefs = { active_cleanup: (() => void) | null };

function get_native_fullscreen_element(): Element | null {
	return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

async function call_native_request(el: HTMLElement): Promise<boolean> {
	const fn = el.requestFullscreen ?? el.webkitRequestFullscreen;
	if (typeof fn !== 'function') return false;
	try {
		await fn.call(el);
		return true;
	} catch {
		return false;
	}
}

async function call_native_exit(): Promise<void> {
	const fn = document.exitFullscreen ?? document.webkitExitFullscreen;
	if (typeof fn !== 'function') return;
	try {
		await fn.call(document);
	} catch {
		/* ignore */
	}
}

function update_native_flag(s: FullscreenState): void {
	s.is_native_fullscreen = get_native_fullscreen_element() !== null;
	if (s.is_native_fullscreen) s.is_pseudo_fullscreen = false;
}

async function request_fullscreen(s: FullscreenState, el: HTMLElement): Promise<void> {
	if (s.is_native_fullscreen || s.is_pseudo_fullscreen) return;
	const did_succeed = await call_native_request(el);
	if (!did_succeed) s.is_pseudo_fullscreen = true;
}

async function exit_fullscreen(s: FullscreenState): Promise<void> {
	if (s.is_pseudo_fullscreen) {
		s.is_pseudo_fullscreen = false;
		return;
	}
	if (s.is_native_fullscreen) await call_native_exit();
}

function setup_fullscreen_listeners(s: FullscreenState, refs: FullscreenRefs): () => void {
	if (refs.active_cleanup) return refs.active_cleanup;
	const handler = (): void => update_native_flag(s);
	update_native_flag(s);
	document.addEventListener('fullscreenchange', handler);
	document.addEventListener('webkitfullscreenchange', handler);
	const cleanup = function cleanup(): void {
		document.removeEventListener('fullscreenchange', handler);
		document.removeEventListener('webkitfullscreenchange', handler);
		refs.active_cleanup = null;
		s.is_native_fullscreen = false;
		s.is_pseudo_fullscreen = false;
	};
	refs.active_cleanup = cleanup;
	return cleanup;
}

export function create_fullscreen() {
	const s = $state<FullscreenState>({ is_pseudo_fullscreen: false, is_native_fullscreen: false });
	const refs: FullscreenRefs = { active_cleanup: null };
	return {
		get is_pseudo_fullscreen() {
			return s.is_pseudo_fullscreen;
		},
		get is_native_fullscreen() {
			return s.is_native_fullscreen;
		},
		get is_active() {
			return s.is_native_fullscreen || s.is_pseudo_fullscreen;
		},
		request: (el: HTMLElement): Promise<void> => request_fullscreen(s, el),
		exit: (): Promise<void> => exit_fullscreen(s),
		setup_listeners: (): (() => void) => setup_fullscreen_listeners(s, refs)
	};
}

export type FullscreenInstance = ReturnType<typeof create_fullscreen>;

export const fullscreen = create_fullscreen();
