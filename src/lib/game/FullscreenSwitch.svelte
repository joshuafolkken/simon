<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { fullscreen } from '$lib/game/fullscreen.svelte';
	import { fullscreen_switch_input } from '$lib/game/fullscreen-switch-input';
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

	interface Props {
		font: string;
		font_size_multiplier: number;
		label: string;
	}

	const SWITCH_X = 2.6;
	const ACTIVE_COLOR = '#00ff88';
	const INACTIVE_COLOR = '#006644';
	const ACTIVE_HOUSING = '#001a0e';
	const INACTIVE_HOUSING = '#001a0e';
	const ACTIVE_HOUSING_EMISSIVE = 0.4;
	const INACTIVE_HOUSING_EMISSIVE = 0.05;
	const ACTIVE_RING_EMISSIVE = 4.0;
	const INACTIVE_RING_EMISSIVE = 0.3;
	const ACTIVE_ORB_EMISSIVE = 5.0;
	const INACTIVE_ORB_EMISSIVE = 0.2;

	let { font, font_size_multiplier, label }: Props = $props();

	let is_active = $derived(fullscreen.is_active);
	let current_color = $derived(is_active ? ACTIVE_COLOR : INACTIVE_COLOR);
	let housing_color = $derived(is_active ? ACTIVE_HOUSING : INACTIVE_HOUSING);
	let housing_emissive = $derived(is_active ? ACTIVE_HOUSING_EMISSIVE : INACTIVE_HOUSING_EMISSIVE);
	let ring_emissive = $derived(is_active ? ACTIVE_RING_EMISSIVE : INACTIVE_RING_EMISSIVE);
	let orb_emissive = $derived(is_active ? ACTIVE_ORB_EMISSIVE : INACTIVE_ORB_EMISSIVE);
	let current_font_size = $derived(LABEL_FONT_SIZE * font_size_multiplier);
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
	<T.Mesh position.z={HIT_AREA_Z} onclick={fullscreen_switch_input.on_click}>
		<T.CircleGeometry args={[HIT_AREA_RADIUS, HIT_AREA_SEGMENTS]} />
		<T.MeshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
	</T.Mesh>
	<T.Mesh position.z={ORB_Z}>
		<T.SphereGeometry args={[LIGHT_HIT_RADIUS, LIGHT_HIT_SEGMENTS, LIGHT_HIT_SEGMENTS]} />
		<T.MeshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
	</T.Mesh>
	<T.Group position={[0, -LABEL_Y_OFFSET, LABEL_Z]}>
		<Text
			text={label}
			{font}
			fontSize={current_font_size}
			color="#ffffff"
			anchorX="center"
			anchorY="middle"
		/>
	</T.Group>
</T.Group>
