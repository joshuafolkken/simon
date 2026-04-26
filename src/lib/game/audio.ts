let ctx: AudioContext | null = null;

function init_audio(): void {
	if (!ctx && typeof AudioContext !== 'undefined') {
		ctx = new AudioContext();
	}
}

function get_audio_context(): AudioContext | null {
	return ctx;
}

export const audio = { init_audio, get_audio_context };
