import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import VirtualJoystick from './VirtualJoystick.svelte';

describe('VirtualJoystick', () => {
	it('renders sprint button', () => {
		const { container } = render(VirtualJoystick);
		expect(container.querySelector('[data-testid="sprint-btn"]')).toBeTruthy();
	});

	it('renders jump button', () => {
		const { container } = render(VirtualJoystick);
		expect(container.querySelector('[data-testid="jump-btn"]')).toBeTruthy();
	});

	it('joystick-zone does not capture pointer events on non-touch devices', () => {
		const { container } = render(VirtualJoystick);
		const zone = container.querySelector<HTMLElement>('.joystick-zone');
		expect(zone).toBeTruthy();
		if (!zone) return;
		expect(getComputedStyle(zone).pointerEvents).toBe('none');
	});
});
