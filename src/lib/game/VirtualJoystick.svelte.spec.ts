import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import VirtualJoystick from './VirtualJoystick.svelte';

describe('VirtualJoystick', () => {
	it('renders sprint button', () => {
		const { container } = render(VirtualJoystick);
		expect(container.querySelector('[data-testid="sprint-btn"]')).toBeTruthy();
	});
});
