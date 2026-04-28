declare global {
	interface Element {
		webkitRequestFullscreen?: () => Promise<void> | void;
	}
	interface Document {
		webkitFullscreenElement?: Element | null;
		webkitExitFullscreen?: () => Promise<void> | void;
	}
}

let is_pseudo_fullscreen = $state(false);
let is_native_fullscreen = $state(false);
let active_cleanup: (() => void) | null = null;

function get_native_fullscreen_element(): Element | null {
	return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

function on_fullscreen_change(): void {
	is_native_fullscreen = get_native_fullscreen_element() !== null;
	if (is_native_fullscreen) is_pseudo_fullscreen = false;
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

async function request(el: HTMLElement): Promise<void> {
	if (is_native_fullscreen || is_pseudo_fullscreen) return;
	const did_succeed = await call_native_request(el);
	if (!did_succeed) is_pseudo_fullscreen = true;
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

async function exit(): Promise<void> {
	if (is_pseudo_fullscreen) {
		is_pseudo_fullscreen = false;
		return;
	}
	if (is_native_fullscreen) await call_native_exit();
}

function setup_listeners(): () => void {
	if (active_cleanup) return active_cleanup;
	on_fullscreen_change();
	document.addEventListener('fullscreenchange', on_fullscreen_change);
	document.addEventListener('webkitfullscreenchange', on_fullscreen_change);
	active_cleanup = function cleanup(): void {
		document.removeEventListener('fullscreenchange', on_fullscreen_change);
		document.removeEventListener('webkitfullscreenchange', on_fullscreen_change);
		active_cleanup = null;
		is_native_fullscreen = false;
		is_pseudo_fullscreen = false;
	};
	return active_cleanup;
}

export const fullscreen = {
	get is_pseudo_fullscreen() {
		return is_pseudo_fullscreen;
	},
	get is_native_fullscreen() {
		return is_native_fullscreen;
	},
	get is_active() {
		return is_native_fullscreen || is_pseudo_fullscreen;
	},
	request,
	exit,
	setup_listeners
};
