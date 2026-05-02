<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import click_url from '$lib/assets/sound/dragon-studio-distorted-electronic-click-472367.opus';
	import { loading } from '$lib/game/loading.svelte';
	import { switch_audio } from '$lib/game/switch-audio';
	import { messages } from '$lib/messages/en';

	loading.configure({
		downloading: messages.loading_downloading,
		initializing: messages.loading_initializing,
		loading_assets: messages.loading_loading_assets,
		ready: messages.loading_ready
	});
	switch_audio.init(click_url);
	loading.set_step('initializing');

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
