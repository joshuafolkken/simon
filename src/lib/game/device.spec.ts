import { describe, it, expect, afterEach } from 'vitest';
import { device } from '$lib/game/device';

const TOUCH_PRIMARY_QUERY = '(hover: none) and (pointer: coarse)';

type MatchMediaCarrier = { matchMedia?: typeof globalThis.matchMedia };

function make_mql(matches: boolean): MediaQueryList {
	return { matches } as unknown as MediaQueryList;
}

describe('device.is_touch_primary', () => {
	const carrier = globalThis as MatchMediaCarrier;
	const original = carrier.matchMedia;

	afterEach(() => {
		if (original === undefined) {
			delete carrier.matchMedia;
		} else {
			carrier.matchMedia = original;
		}
	});

	it('returns true when the touch-primary media query matches', () => {
		let received_query = '';
		carrier.matchMedia = function fake(query: string): MediaQueryList {
			received_query = query;
			return make_mql(true);
		};
		expect(device.is_touch_primary()).toBe(true);
		expect(received_query).toBe(TOUCH_PRIMARY_QUERY);
	});

	it('returns false when the touch-primary media query does not match', () => {
		carrier.matchMedia = function fake(): MediaQueryList {
			return make_mql(false);
		};
		expect(device.is_touch_primary()).toBe(false);
	});
});
