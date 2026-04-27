<script lang="ts">
	import { T, useThrelte, useTask } from '@threlte/core';
	import { interactivity, Text } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import Room from './Room.svelte';
	import Player from './Player.svelte';
	import SimonBoard from './SimonBoard.svelte';
	import CyberSwitch from './CyberSwitch.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { make_pointer_compute } from '$lib/game/pointer-compute.js';
	import { lighting } from '$lib/game/lighting';
	import { messages } from '$lib/messages/en';

	const POINT_LIGHT_Y = 2.5;
	const NORMAL_BG = '#0d0d12';
	const CYBER_BG = '#030318';
	const TITLE_FONT_SIZE = 0.6;
	const TITLE_Y = 2.5;
	const TITLE_Z = -1;
	const BOB_SPEED = 0.001;
	const BOB_AMPLITUDE = 0.05;

	const { camera } = useThrelte();
	interactivity({ compute: make_pointer_compute(camera) });

	let bg_color = $derived(game_state.is_cyber ? CYBER_BG : NORMAL_BG);
	let ambient_intensity = $derived(lighting.get_ambient_intensity(game_state.is_cyber));
	let point_light_intensity = $derived(lighting.get_point_light_intensity(game_state.is_cyber));
	let title_y = $state(TITLE_Y);

	function tick(): void {
		title_y = TITLE_Y + Math.sin(Date.now() * BOB_SPEED) * BOB_AMPLITUDE;
	}

	useTask(tick);
</script>

<T.Color attach="background" args={[bg_color]} />
<T.AmbientLight intensity={ambient_intensity} />
<T.PointLight position={[0, POINT_LIGHT_Y, 0]} intensity={point_light_intensity} castShadow />

<T.Group position={[0, title_y, TITLE_Z]}>
	<Text
		text={messages.game_title}
		fontSize={TITLE_FONT_SIZE}
		color="#ffffff"
		anchorX="center"
		anchorY="middle"
	/>
</T.Group>

<World gravity={[0, 0, 0]}>
	<Room />
	<Player />
	<SimonBoard />
	<CyberSwitch />
</World>
