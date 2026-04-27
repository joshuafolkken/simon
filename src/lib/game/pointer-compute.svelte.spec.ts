import { afterEach, describe, expect, it, vi } from 'vitest';
import { PerspectiveCamera, Raycaster, Vector2 } from 'three';
import { make_pointer_compute } from './pointer-compute.js';

function make_ctx() {
	const v = new Vector2();
	const raycaster = new Raycaster();
	vi.spyOn(raycaster, 'setFromCamera');
	return {
		pointer: {
			current: v,
			update(fn: (p: Vector2) => Vector2) {
				fn(v);
			}
		},
		raycaster
	};
}

function make_camera() {
	return { current: new PerspectiveCamera() };
}

function make_html_target(client_w: number, client_h: number): HTMLElement {
	const el = document.createElement('div');
	Object.defineProperty(el, 'clientWidth', { get: () => client_w });
	Object.defineProperty(el, 'clientHeight', { get: () => client_h });
	return el;
}

function make_event(offset_x: number, offset_y: number, target: EventTarget | null): MouseEvent {
	// MouseEvent.target is read-only; use object spread cast for mock events
	return { offsetX: offset_x, offsetY: offset_y, target } as unknown as MouseEvent;
}

const CENTER = 0;
const WIDTH = 800;
const HEIGHT = 600;
// Off-center coordinates: unlocked normalization gives (-0.75, 0.667), not (0,0)
const LOCKED_OFFSET_X = 100;
const LOCKED_OFFSET_Y = 100;
// Center coordinates for unlocked test: (400/800)*2-1=0, -(300/600)*2+1=0
const UNLOCKED_OFFSET_X = 400;
const UNLOCKED_OFFSET_Y = 300;
const SKIP_OFFSET_X = 100;
const SKIP_OFFSET_Y = 100;

// Expected NDC for off-center locked test if lock were bypassed
const EXPECTED_LOCKED_X = CENTER;
const EXPECTED_LOCKED_Y = CENTER;

describe('make_pointer_compute', () => {
	afterEach(() => vi.restoreAllMocks());

	it('sets pointer to (0,0) and calls setFromCamera when pointer lock is active', () => {
		vi.spyOn(Document.prototype, 'pointerLockElement', 'get').mockReturnValue(document.body);
		const camera = make_camera();
		const compute = make_pointer_compute(camera);
		const ctx = make_ctx();
		ctx.pointer.current.set(0.5, 0.5);

		// Off-center: unlocked normalization would yield (-0.75, 0.667), not (0,0)
		compute(make_event(LOCKED_OFFSET_X, LOCKED_OFFSET_Y, make_html_target(WIDTH, HEIGHT)), ctx);

		expect(ctx.pointer.current.x).toBe(EXPECTED_LOCKED_X);
		expect(ctx.pointer.current.y).toBe(EXPECTED_LOCKED_Y);
		expect(ctx.raycaster.setFromCamera).toHaveBeenCalledWith(ctx.pointer.current, camera.current);
	});

	it('normalizes offsetX/Y by clientWidth/clientHeight when not locked', () => {
		vi.spyOn(Document.prototype, 'pointerLockElement', 'get').mockReturnValue(null);
		const camera = make_camera();
		const compute = make_pointer_compute(camera);
		const ctx = make_ctx();

		// (400/800)*2-1=0, -(300/600)*2+1=0
		compute(make_event(UNLOCKED_OFFSET_X, UNLOCKED_OFFSET_Y, make_html_target(WIDTH, HEIGHT)), ctx);

		expect(ctx.pointer.current.x).toBeCloseTo(CENTER);
		expect(ctx.pointer.current.y).toBeCloseTo(CENTER);
		expect(ctx.raycaster.setFromCamera).toHaveBeenCalledWith(ctx.pointer.current, camera.current);
	});

	it('skips pointer update and raycasting when target has zero dimensions', () => {
		vi.spyOn(Document.prototype, 'pointerLockElement', 'get').mockReturnValue(null);
		const camera = make_camera();
		const compute = make_pointer_compute(camera);
		const ctx = make_ctx();
		ctx.pointer.current.set(0.5, 0.5);

		compute(make_event(SKIP_OFFSET_X, SKIP_OFFSET_Y, make_html_target(0, 0)), ctx);

		expect(ctx.pointer.current.x).toBe(0.5);
		expect(ctx.pointer.current.y).toBe(0.5);
		expect(ctx.raycaster.setFromCamera).not.toHaveBeenCalled();
	});

	it('skips pointer update and raycasting when target is null', () => {
		vi.spyOn(Document.prototype, 'pointerLockElement', 'get').mockReturnValue(null);
		const camera = make_camera();
		const compute = make_pointer_compute(camera);
		const ctx = make_ctx();
		ctx.pointer.current.set(0.5, 0.5);

		compute(make_event(SKIP_OFFSET_X, SKIP_OFFSET_Y, null), ctx);

		expect(ctx.pointer.current.x).toBe(0.5);
		expect(ctx.pointer.current.y).toBe(0.5);
		expect(ctx.raycaster.setFromCamera).not.toHaveBeenCalled();
	});
});
