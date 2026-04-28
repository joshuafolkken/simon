const TOUCH_PRIMARY_QUERY = '(hover: none) and (pointer: coarse)';

function is_touch_primary(): boolean {
	return globalThis.matchMedia(TOUCH_PRIMARY_QUERY).matches;
}

export const device = {
	is_touch_primary
};
