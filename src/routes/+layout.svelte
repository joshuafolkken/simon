<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import click_url from '$lib/assets/sound/dragon-studio-distorted-electronic-click-472367.opus';
	import { loading } from '$lib/game/loading.svelte';
	import { switch_audio } from '$lib/game/switch-audio';
	import { simon_board_input } from '$lib/simon/simon-board-input';
	import { cyber_switch_input } from '$lib/game/cyber-switch-input';
	import { simon } from '$lib/simon/simon.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { messages } from '$lib/messages/en';

	loading.configure({
		downloading: messages.loading_downloading,
		initializing: messages.loading_initializing,
		loading_assets: messages.loading_loading_assets,
		ready: messages.loading_ready
	});
	switch_audio.init(click_url);
	simon_board_input.configure({
		on_press: (color) => simon.press(color),
		on_release: () => simon.release(),
		on_start: () => simon.start()
	});
	cyber_switch_input.configure({ on_toggle: game_state.toggle_alt });
	loading.set_step('initializing');

	let { children } = $props();
</script>

<svelte:head>
	<title>{messages.game_title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>
{@render children()}
