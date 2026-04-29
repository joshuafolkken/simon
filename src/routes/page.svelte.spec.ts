import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';
import { game_state } from '$lib/game/state.svelte';

describe('Home page', () => {
	beforeEach(() => {
		if (game_state.is_cyber) game_state.toggle_cyber();
	});

	afterEach(() => {
		if (game_state.is_cyber) game_state.toggle_cyber();
	});

	it('does not render cyber-glow in normal mode', () => {
		const { container } = render(Page);
		expect(container.querySelector('[data-testid="cyber-glow"]')).toBeNull();
	});

	it('renders cyber-glow overlay when cyber mode is active', () => {
		game_state.toggle_cyber();
		const { container } = render(Page);
		expect(container.querySelector('[data-testid="cyber-glow"]')).toBeTruthy();
	});
});
