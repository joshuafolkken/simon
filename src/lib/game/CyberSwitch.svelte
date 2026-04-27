<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { game_state } from '$lib/game/state.svelte';
	import { fonts } from '$lib/game/fonts';
	import { messages } from '$lib/messages/en';
	import { HALF_D } from '$lib/game/room-config';

	const SWITCH_X = 1.0;
	const SWITCH_Y = 1.2;
	const BASE_RADIUS = 0.32;
	const BASE_DEPTH = 0.06;
	const BASE_HALF_DEPTH = BASE_DEPTH / 2;
	const SWITCH_Z = -(HALF_D - BASE_HALF_DEPTH);
	const HEX_FACES = 6;
	const RING_RADIUS = 0.26;
	const RING_TUBE = 0.025;
	const RING_RADIAL = 8;
	const RING_TUBULAR = 48;
	const ORB_RADIUS = 0.13;
	const ORB_SEGMENTS = 16;
	const ORB_EMBED = 0.5;
	const ORB_Z = BASE_HALF_DEPTH + ORB_RADIUS * ORB_EMBED;
	const HIT_AREA_RADIUS = BASE_RADIUS;
	const HIT_AREA_Z_OFFSET = 0.01;
	const HIT_AREA_Z = ORB_Z + ORB_RADIUS + HIT_AREA_Z_OFFSET;
	const HIT_AREA_SEGMENTS = 32;
	const LABEL_FONT_SIZE = 0.1;
	const LABEL_Y_OFFSET = 0.38;
	const LABEL_Z = 0.05;
	const FACE_ROTATION_X = Math.PI / 2;
	const NORMAL_COLOR = '#00aaff';
	const CYBER_COLOR = '#ff00ff';
	const NORMAL_HOUSING = '#001122';
	const CYBER_HOUSING = '#120022';
	const METALNESS = 0.8;
	const ROUGHNESS_HOUSING = 0.3;
	const ORB_ROUGHNESS = 0.05;
	const NORMAL_HOUSING_EMISSIVE = 0.15;
	const CYBER_HOUSING_EMISSIVE = 0.4;
	const NORMAL_RING_EMISSIVE = 0.8;
	const CYBER_RING_EMISSIVE = 4.0;
	const NORMAL_ORB_EMISSIVE = 0.6;
	const CYBER_ORB_EMISSIVE = 5.0;

	function handle_click(): void {
		game_state.toggle_cyber();
	}

	let current_font = $derived(fonts.get_font(game_state.is_cyber));
	let current_color = $derived(game_state.is_cyber ? CYBER_COLOR : NORMAL_COLOR);
	let housing_color = $derived(game_state.is_cyber ? CYBER_HOUSING : NORMAL_HOUSING);
	let housing_emissive = $derived(
		game_state.is_cyber ? CYBER_HOUSING_EMISSIVE : NORMAL_HOUSING_EMISSIVE
	);
	let ring_emissive = $derived(game_state.is_cyber ? CYBER_RING_EMISSIVE : NORMAL_RING_EMISSIVE);
	let orb_emissive = $derived(game_state.is_cyber ? CYBER_ORB_EMISSIVE : NORMAL_ORB_EMISSIVE);
</script>

<T.Group position={[SWITCH_X, SWITCH_Y, SWITCH_Z]}>
	<T.Mesh onclick={handle_click} rotation.x={FACE_ROTATION_X}>
		<T.CylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, BASE_DEPTH, HEX_FACES]} />
		<T.MeshStandardMaterial
			color={housing_color}
			emissive={current_color}
			emissiveIntensity={housing_emissive}
			metalness={METALNESS}
			roughness={ROUGHNESS_HOUSING}
		/>
	</T.Mesh>
	<T.Mesh position.z={BASE_HALF_DEPTH} onclick={handle_click}>
		<T.TorusGeometry args={[RING_RADIUS, RING_TUBE, RING_RADIAL, RING_TUBULAR]} />
		<T.MeshStandardMaterial
			color={current_color}
			emissive={current_color}
			emissiveIntensity={ring_emissive}
		/>
	</T.Mesh>
	<T.Mesh position.z={ORB_Z} onclick={handle_click}>
		<T.SphereGeometry args={[ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS]} />
		<T.MeshStandardMaterial
			color={current_color}
			emissive={current_color}
			emissiveIntensity={orb_emissive}
			roughness={ORB_ROUGHNESS}
		/>
	</T.Mesh>
	<T.Mesh position.z={HIT_AREA_Z} onclick={handle_click}>
		<T.CircleGeometry args={[HIT_AREA_RADIUS, HIT_AREA_SEGMENTS]} />
		<T.MeshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
	</T.Mesh>
	<T.Group position={[0, -LABEL_Y_OFFSET, LABEL_Z]}>
		<Text
			text={messages.cyber_switch_label}
			font={current_font}
			fontSize={LABEL_FONT_SIZE}
			color="#ffffff"
			anchorX="center"
			anchorY="middle"
		/>
	</T.Group>
</T.Group>
