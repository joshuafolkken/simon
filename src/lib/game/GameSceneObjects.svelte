<script lang="ts">
	import { T, useThrelte, useTask } from '@threlte/core';
	import { interactivity, Text } from '@threlte/extras';
	import Room from './Room.svelte';
	import Player from './Player.svelte';
	import SimonBoard from './SimonBoard.svelte';
	import CyberSwitch from './CyberSwitch.svelte';
	import FullscreenSwitch from './FullscreenSwitch.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import { make_pointer_compute } from '$lib/game/pointer-compute.js';
	import { lighting } from '$lib/game/lighting';
	import { fonts } from '$lib/game/fonts';
	import { messages } from '$lib/messages/en';
	import { ROOM_W, ROOM_D, ROOM_H } from '$lib/game/room-config';

	const POINT_LIGHT_Y = 2.5;
	const NORMAL_BG = '#0d0d12';
	const CYBER_BG = '#030318';
	const TITLE_FONT_SIZE = 0.6;
	const TITLE_Y = 2.5;
	const TITLE_Z = -1;
	const BOB_SPEED = 0.001;
	const BOB_AMPLITUDE = 0.05;
	const CYBER_ACCENT_COLOR = '#ff00ff';
	const CYBER_ACCENT_INTENSITY = 6;
	const CYBER_ACCENT_Y = 0.5;
	const CYBER_ACCENT_Z = -2;
	const NEON_CEILING_Y = 2.9;
	const NEON_TUBE_RADIUS = 0.02;
	const NEON_TUBE_LENGTH = 8;
	const NEON_TUBE_SEGMENTS = 8;
	const NEON_EMISSIVE = 3.0;
	const NEON_LIGHT_INTENSITY = 12;
	const NEON_Z_BACK = -3.5;
	const NEON_Z_MID = -1;
	const NEON_MAGENTA = '#ff00ff';
	const NEON_CYAN = '#00ffff';
	const NEON_TUBE_ROTATION = Math.PI / 2;
	const FLOOR_COLOR = '#3a2f2f';
	const WALL_COLOR = '#4a4a5a';
	const CEILING_COLOR = '#2a2a3a';
	const CYBER_FLOOR_COLOR = '#0d2525';
	const CYBER_WALL_COLOR = '#0a2035';
	const CYBER_CEILING_COLOR = '#08082a';

	const { camera } = useThrelte();
	interactivity({ compute: make_pointer_compute(camera) });

	let is_cyber = $derived(game_state.is_cyber);
	let bg_color = $derived(is_cyber ? CYBER_BG : NORMAL_BG);
	let ambient_intensity = $derived(lighting.get_ambient_intensity(is_cyber));
	let ambient_color = $derived(lighting.get_ambient_color(is_cyber));
	let point_light_intensity = $derived(lighting.get_point_light_intensity(is_cyber));
	let current_font = $derived(fonts.get_font(is_cyber));
	let current_title_font_size = $derived(
		TITLE_FONT_SIZE * fonts.get_font_size_multiplier(is_cyber)
	);
	let floor_color = $derived(is_cyber ? CYBER_FLOOR_COLOR : FLOOR_COLOR);
	let wall_color = $derived(is_cyber ? CYBER_WALL_COLOR : WALL_COLOR);
	let ceiling_color = $derived(is_cyber ? CYBER_CEILING_COLOR : CEILING_COLOR);
	let title_y = $state(TITLE_Y);

	function tick(): void {
		title_y = TITLE_Y + Math.sin(Date.now() * BOB_SPEED) * BOB_AMPLITUDE;
	}

	useTask(tick);
</script>

<T.Color attach="background" args={[bg_color]} />
<T.AmbientLight intensity={ambient_intensity} color={ambient_color} />
<T.PointLight position={[0, POINT_LIGHT_Y, 0]} intensity={point_light_intensity} castShadow />
{#if is_cyber}
	<T.PointLight
		position={[0, CYBER_ACCENT_Y, CYBER_ACCENT_Z]}
		color={CYBER_ACCENT_COLOR}
		intensity={CYBER_ACCENT_INTENSITY}
	/>
	<T.Mesh position={[0, NEON_CEILING_Y, NEON_Z_BACK]} rotation.z={NEON_TUBE_ROTATION}>
		<T.CylinderGeometry
			args={[NEON_TUBE_RADIUS, NEON_TUBE_RADIUS, NEON_TUBE_LENGTH, NEON_TUBE_SEGMENTS]}
		/>
		<T.MeshStandardMaterial
			color={NEON_MAGENTA}
			emissive={NEON_MAGENTA}
			emissiveIntensity={NEON_EMISSIVE}
		/>
	</T.Mesh>
	<T.PointLight
		position={[0, NEON_CEILING_Y, NEON_Z_BACK]}
		color={NEON_MAGENTA}
		intensity={NEON_LIGHT_INTENSITY}
	/>
	<T.Mesh position={[0, NEON_CEILING_Y, NEON_Z_MID]} rotation.z={NEON_TUBE_ROTATION}>
		<T.CylinderGeometry
			args={[NEON_TUBE_RADIUS, NEON_TUBE_RADIUS, NEON_TUBE_LENGTH, NEON_TUBE_SEGMENTS]}
		/>
		<T.MeshStandardMaterial
			color={NEON_CYAN}
			emissive={NEON_CYAN}
			emissiveIntensity={NEON_EMISSIVE}
		/>
	</T.Mesh>
	<T.PointLight
		position={[0, NEON_CEILING_Y, NEON_Z_MID]}
		color={NEON_CYAN}
		intensity={NEON_LIGHT_INTENSITY}
	/>
{/if}

<T.Group position={[0, title_y, TITLE_Z]}>
	<Text
		text={messages.game_title}
		font={current_font}
		fontSize={current_title_font_size}
		color="#ffffff"
		anchorX="center"
		anchorY="middle"
	/>
</T.Group>

<Room width={ROOM_W} depth={ROOM_D} height={ROOM_H} {floor_color} {wall_color} {ceiling_color} />
<Player />
<SimonBoard />
<CyberSwitch />
<FullscreenSwitch
	font={current_font}
	font_size_multiplier={fonts.get_font_size_multiplier(is_cyber)}
	label={messages.fullscreen_switch_label}
/>
