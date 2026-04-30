import click_url from '$lib/assets/sound/dragon-studio-distorted-electronic-click-472367.opus';

let click_sound: HTMLAudioElement | null = null;

function play_switch_click(): void {
	if (typeof Audio === 'undefined') return;
	if (!click_sound) click_sound = new Audio(click_url);
	click_sound.currentTime = 0;
	void click_sound.play();
}

export const switch_audio = { play_switch_click };
