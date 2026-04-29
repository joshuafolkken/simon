<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { resolve_switch_colors } from '$lib/game/switch-colors';
	import type { SwitchColors } from '$lib/game/switch-colors';
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
		position_x: number;
		is_active: boolean;
		label: string;
		font: string;
		font_size_multiplier: number;
		onclick: () => void;
		colors: SwitchColors;
	}

	let { position_x, is_active, label, font, font_size_multiplier, onclick, colors }: Props =
		$props();

	let resolved = $derived(resolve_switch_colors(colors, is_active));
	let current_font_size = $derived(LABEL_FONT_SIZE * font_size_multiplier);
</script>

<T.Group position={[position_x, SWITCH_Y, SWITCH_Z]}>
	<T.Mesh position.z={MOUNT_PLATE_Z} rotation.x={FACE_ROTATION_X}>
		<T.CylinderGeometry
			args={[MOUNT_PLATE_RADIUS, MOUNT_PLATE_RADIUS, MOUNT_PLATE_DEPTH, HEX_FACES]}
		/>
		<T.MeshStandardMaterial
			color={resolved.housing_color}
			emissive={resolved.current_color}
			emissiveIntensity={MOUNT_PLATE_EMISSIVE}
			metalness={METALNESS}
			roughness={ROUGHNESS_HOUSING}
		/>
	</T.Mesh>
	<T.Mesh rotation.x={FACE_ROTATION_X}>
		<T.CylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, BASE_DEPTH, HEX_FACES]} />
		<T.MeshStandardMaterial
			color={resolved.housing_color}
			emissive={resolved.current_color}
			emissiveIntensity={resolved.housing_emissive}
			metalness={METALNESS}
			roughness={ROUGHNESS_HOUSING}
		/>
	</T.Mesh>
	<T.Mesh position.z={BASE_HALF_DEPTH}>
		<T.TorusGeometry args={[RING_RADIUS, RING_TUBE, RING_RADIAL, RING_TUBULAR]} />
		<T.MeshStandardMaterial
			color={resolved.current_color}
			emissive={resolved.current_color}
			emissiveIntensity={resolved.ring_emissive}
		/>
	</T.Mesh>
	<T.Mesh position.z={ORB_Z}>
		<T.SphereGeometry args={[ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS]} />
		<T.MeshStandardMaterial
			color={resolved.current_color}
			emissive={resolved.current_color}
			emissiveIntensity={resolved.orb_emissive}
			roughness={ORB_ROUGHNESS}
		/>
	</T.Mesh>
	<T.Mesh position.z={HIT_AREA_Z} {onclick}>
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
