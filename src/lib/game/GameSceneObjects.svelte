<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import Room from './Room.svelte';
	import Player from './Player.svelte';
	import SimonBoard from './SimonBoard.svelte';
	import CyberSwitch from './CyberSwitch.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { make_pointer_compute } from '$lib/game/pointer-compute.js';

	const AMBIENT_INTENSITY = 0.3;
	const POINT_LIGHT_INTENSITY = 8;
	const POINT_LIGHT_Y = 2.5;
	const NORMAL_BG = '#0d0d12';
	const CYBER_BG = '#030318';

	const { camera } = useThrelte();
	interactivity({ compute: make_pointer_compute(camera) });

	let bg_color = $derived(game_state.is_cyber ? CYBER_BG : NORMAL_BG);
</script>

<T.Color attach="background" args={[bg_color]} />
<T.AmbientLight intensity={AMBIENT_INTENSITY} />
<T.PointLight position={[0, POINT_LIGHT_Y, 0]} intensity={POINT_LIGHT_INTENSITY} castShadow />

<World gravity={[0, 0, 0]}>
	<Room />
	<Player />
	<SimonBoard />
	<CyberSwitch />
</World>
