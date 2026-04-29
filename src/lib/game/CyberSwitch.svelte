<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { game_state } from '$lib/game/state.svelte';
	import { fonts } from '$lib/game/fonts';
	import { messages } from '$lib/messages/en';
	import { cyber_switch_input } from '$lib/game/cyber-switch-input';
	import {
		SWITCH_Y,
		BASE_RADIUS,
		BASE_DEPTH,
		BASE_HALF_DEPTH,
		SWITCH_Z,
		MOUNT_PLATE_RADIUS,
		MOUNT_PLATE_DEPTH,
		MOUNT_PLATE_Z,
		MOUNT_PLATE_EMISSIVE,
		HEX_FACES,
		RING_RADIUS,
		RING_TUBE,
		RING_RADIAL,
		RING_TUBULAR,
		ORB_RADIUS,
		ORB_SEGMENTS,
		ORB_Z,
		HIT_AREA_RADIUS,
		HIT_AREA_Z,
		HIT_AREA_SEGMENTS,
		LIGHT_HIT_RADIUS,
		LIGHT_HIT_SEGMENTS,
		LABEL_FONT_SIZE,
		LABEL_Y_OFFSET,
		LABEL_Z,
		FACE_ROTATION_X,
		METALNESS,
		ROUGHNESS_HOUSING,
		ORB_ROUGHNESS
	} from '$lib/game/switch-config';

	const SWITCH_X = 1.6;
	const NORMAL_COLOR = '#00aaff';
	const CYBER_COLOR = '#ff00ff';
	const NORMAL_HOUSING = '#001122';
	const CYBER_HOUSING = '#120022';
	const NORMAL_HOUSING_EMISSIVE = 0.15;
	const CYBER_HOUSING_EMISSIVE = 0.4;
	const NORMAL_RING_EMISSIVE = 0.8;
	const CYBER_RING_EMISSIVE = 4.0;
	const NORMAL_ORB_EMISSIVE = 0.6;
	const CYBER_ORB_EMISSIVE = 5.0;

	let current_font = $derived(fonts.get_font(game_state.is_cyber));
	let current_color = $derived(game_state.is_cyber ? CYBER_COLOR : NORMAL_COLOR);
	let housing_color = $derived(game_state.is_cyber ? CYBER_HOUSING : NORMAL_HOUSING);
	let housing_emissive = $derived(
		game_state.is_cyber ? CYBER_HOUSING_EMISSIVE : NORMAL_HOUSING_EMISSIVE
	);
	let ring_emissive = $derived(game_state.is_cyber ? CYBER_RING_EMISSIVE : NORMAL_RING_EMISSIVE);
	let orb_emissive = $derived(game_state.is_cyber ? CYBER_ORB_EMISSIVE : NORMAL_ORB_EMISSIVE);
	let current_font_size = $derived(
		LABEL_FONT_SIZE * fonts.get_font_size_multiplier(game_state.is_cyber)
	);
</script>

<T.Group position={[SWITCH_X, SWITCH_Y, SWITCH_Z]}>
	<T.Mesh position.z={MOUNT_PLATE_Z} rotation.x={FACE_ROTATION_X}>
		<T.CylinderGeometry
			args={[MOUNT_PLATE_RADIUS, MOUNT_PLATE_RADIUS, MOUNT_PLATE_DEPTH, HEX_FACES]}
		/>
		<T.MeshStandardMaterial
			color={housing_color}
			emissive={current_color}
			emissiveIntensity={MOUNT_PLATE_EMISSIVE}
			metalness={METALNESS}
			roughness={ROUGHNESS_HOUSING}
		/>
	</T.Mesh>
	<T.Mesh rotation.x={FACE_ROTATION_X}>
		<T.CylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, BASE_DEPTH, HEX_FACES]} />
		<T.MeshStandardMaterial
			color={housing_color}
			emissive={current_color}
			emissiveIntensity={housing_emissive}
			metalness={METALNESS}
			roughness={ROUGHNESS_HOUSING}
		/>
	</T.Mesh>
	<T.Mesh position.z={BASE_HALF_DEPTH}>
		<T.TorusGeometry args={[RING_RADIUS, RING_TUBE, RING_RADIAL, RING_TUBULAR]} />
		<T.MeshStandardMaterial
			color={current_color}
			emissive={current_color}
			emissiveIntensity={ring_emissive}
		/>
	</T.Mesh>
	<T.Mesh position.z={ORB_Z}>
		<T.SphereGeometry args={[ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS]} />
		<T.MeshStandardMaterial
			color={current_color}
			emissive={current_color}
			emissiveIntensity={orb_emissive}
			roughness={ORB_ROUGHNESS}
		/>
	</T.Mesh>
	<T.Mesh position.z={HIT_AREA_Z} onclick={cyber_switch_input.on_click}>
		<T.CircleGeometry args={[HIT_AREA_RADIUS, HIT_AREA_SEGMENTS]} />
		<T.MeshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
	</T.Mesh>
	<T.Mesh position.z={ORB_Z}>
		<T.SphereGeometry args={[LIGHT_HIT_RADIUS, LIGHT_HIT_SEGMENTS, LIGHT_HIT_SEGMENTS]} />
		<T.MeshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
	</T.Mesh>
	<T.Group position={[0, -LABEL_Y_OFFSET, LABEL_Z]}>
		<Text
			text={messages.cyber_switch_label}
			font={current_font}
			fontSize={current_font_size}
			color="#ffffff"
			anchorX="center"
			anchorY="middle"
		/>
	</T.Group>
</T.Group>
