import { describe, it, expect, beforeEach } from 'vitest';
import { session } from './session.svelte';

describe('session', () => {
	beforeEach(() => {
		session.reset_session();
	});

	it('starts as not-started', () => {
		expect(session.is_session_started).toBe(false);
	});

	it('flips to started on start_session', () => {
		session.start_session();
		expect(session.is_session_started).toBe(true);
	});

	it('start_session is idempotent', () => {
		session.start_session();
		session.start_session();
		expect(session.is_session_started).toBe(true);
	});

	it('reset_session returns to not-started', () => {
		session.start_session();
		session.reset_session();
		expect(session.is_session_started).toBe(false);
	});
});
