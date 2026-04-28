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
	return { offsetX: offset_x, offsetY: offset_y, target } as unknown as MouseEvent;
}

const CENTER = 0;
const WIDTH = 800;
const HEIGHT = 600;
const CENTERED_OFFSET_X = 400;
const CENTERED_OFFSET_Y = 300;
const SKIP_OFFSET_X = 100;
const SKIP_OFFSET_Y = 100;

describe('make_pointer_compute', () => {
	afterEach(() => vi.restoreAllMocks());

	it('normalizes offsetX/Y by clientWidth/clientHeight', () => {
		const camera = make_camera();
		const compute = make_pointer_compute(camera);
		const ctx = make_ctx();

		// (400/800)*2-1=0, -(300/600)*2+1=0
		compute(make_event(CENTERED_OFFSET_X, CENTERED_OFFSET_Y, make_html_target(WIDTH, HEIGHT)), ctx);

		expect(ctx.pointer.current.x).toBeCloseTo(CENTER);
		expect(ctx.pointer.current.y).toBeCloseTo(CENTER);
		expect(ctx.raycaster.setFromCamera).toHaveBeenCalledWith(ctx.pointer.current, camera.current);
	});

	it('skips pointer update and raycasting when target has zero dimensions', () => {
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
