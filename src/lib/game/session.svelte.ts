let is_session_started = $state(false);

function start_session(): void {
	is_session_started = true;
}

function reset_session(): void {
	is_session_started = false;
}

export const session = {
	get is_session_started() {
		return is_session_started;
	},
	start_session,
	reset_session
};
