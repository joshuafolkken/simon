import { describe, it, expect, beforeEach, vi } from 'vitest';
import { simon_board_input } from './simon-board-input';
import { session } from './session.svelte';
import { simon } from '$lib/simon/simon.svelte';

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;

describe('simon_board_input', () => {
	beforeEach(() => {
		session.reset_session();
		vi.restoreAllMocks();
	});

	describe('on_button_pointer_down', () => {
		it('does not call simon.press when session is not started', () => {
			const spy = vi.spyOn(simon, 'press').mockImplementation(() => {});
			simon_board_input.on_button_pointer_down({ nativeEvent: { button: LEFT_BUTTON } }, 'green');
			expect(spy).not.toHaveBeenCalled();
		});

		it('calls simon.press once session has started', () => {
			session.start_session();
			const spy = vi.spyOn(simon, 'press').mockImplementation(() => {});
			simon_board_input.on_button_pointer_down({ nativeEvent: { button: LEFT_BUTTON } }, 'red');
			expect(spy).toHaveBeenCalledWith('red');
		});

		it('does not call simon.press for non-left click even after session started', () => {
			session.start_session();
			const spy = vi.spyOn(simon, 'press').mockImplementation(() => {});
			simon_board_input.on_button_pointer_down({ nativeEvent: { button: RIGHT_BUTTON } }, 'blue');
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('on_button_release', () => {
		it('does not call simon.release when session is not started', () => {
			const spy = vi.spyOn(simon, 'release').mockImplementation(() => {});
			simon_board_input.on_button_release();
			expect(spy).not.toHaveBeenCalled();
		});

		it('calls simon.release once session has started', () => {
			session.start_session();
			const spy = vi.spyOn(simon, 'release').mockImplementation(() => {});
			simon_board_input.on_button_release();
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('on_center_click', () => {
		it('does not call simon.start when session is not started', () => {
			const spy = vi.spyOn(simon, 'start').mockImplementation(() => {});
			simon_board_input.on_center_click();
			expect(spy).not.toHaveBeenCalled();
		});

		it('calls simon.start once session has started', () => {
			session.start_session();
			const spy = vi.spyOn(simon, 'start').mockImplementation(() => {});
			simon_board_input.on_center_click();
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});
});
