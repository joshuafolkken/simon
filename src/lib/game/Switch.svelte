<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { resolve_switch_colors } from '$lib/game/switch-colors';
	import type { SwitchColors } from '$lib/game/switch-colors';
	import type { SwitchIconType } from '$lib/game/switch-config';
	import {
		SWITCH_Y,
		SWITCH_Z,
		PANEL_SIZE,
		PANEL_DEPTH,
		PANEL_OPACITY_ACTIVE,
		PANEL_OPACITY_INACTIVE,
		BORDER_THICKNESS,
		BORDER_DEPTH,
		BORDER_POS,
		CYBER_OUTER_RING_R,
		CYBER_OUTER_RING_TUBE,
		CYBER_INNER_RING_R,
		CYBER_INNER_RING_TUBE,
		CYBER_RING_RADIAL,
		CYBER_RING_TUBULAR,
		CYBER_INNER_RING_ROTATION,
		CYBER_ORB_R,
		CYBER_ORB_SEGMENTS,
		CYBER_ICON_Z,
		CORNER_ARM,
		CORNER_THICKNESS,
		CORNER_DEPTH,
		CORNER_POS,
		CORNER_ARM_CENTER,
		FULLSCREEN_ICON_Z,
		HIT_AREA_W,
		HIT_AREA_H,
		HIT_AREA_DEPTH,
		HIT_AREA_Z,
		LABEL_FONT_SIZE,
		LABEL_Y_OFFSET,
		LABEL_Z,
		ACTIVE_LIGHT_Z,
		ACTIVE_LIGHT_DISTANCE,
		ACTIVE_LIGHT_INTENSITY
	} from '$lib/game/switch-config';

	type CornerSign = -1 | 1;
	type BarAxis = 'h' | 'v';
	interface CornerBar {
		key: string;
		px: number;
		py: number;
		w: number;
		h: number;
	}

	function make_bar(sx: CornerSign, sy: CornerSign, axis: BarAxis): CornerBar {
		const is_h = axis === 'h';
		return {
			key: `${axis}${sx}${sy}`,
			px: sx * (is_h ? CORNER_ARM_CENTER : CORNER_POS),
			py: sy * (is_h ? CORNER_POS : CORNER_ARM_CENTER),
			w: is_h ? CORNER_ARM : CORNER_THICKNESS,
			h: is_h ? CORNER_THICKNESS : CORNER_ARM
		};
	}

	const CORNER_SIGNS: readonly CornerSign[] = [-1, 1];
	const CORNER_BARS: readonly CornerBar[] = CORNER_SIGNS.flatMap(function (sx): CornerBar[] {
		return CORNER_SIGNS.flatMap(function (sy): CornerBar[] {
			return [make_bar(sx, sy, 'h'), make_bar(sx, sy, 'v')];
		});
	});

	interface Props {
		position_x: number;
		is_active: boolean;
		icon_type: SwitchIconType;
		label: string;
		font: string;
		font_size_multiplier: number;
		onclick: () => void;
		colors: SwitchColors;
	}

	let {
		position_x,
		is_active,
		icon_type,
		label,
		font,
		font_size_multiplier,
		onclick,
		colors
	}: Props = $props();

	let resolved = $derived(resolve_switch_colors(colors, is_active));
	let panel_opacity = $derived(is_active ? PANEL_OPACITY_ACTIVE : PANEL_OPACITY_INACTIVE);
	let current_font_size = $derived(LABEL_FONT_SIZE * font_size_multiplier);
</script>

<T.Group position={[position_x, SWITCH_Y, SWITCH_Z]}>
	<!-- Translucent holographic panel face -->
	<T.Mesh>
		<T.BoxGeometry args={[PANEL_SIZE, PANEL_SIZE, PANEL_DEPTH]} />
		<T.MeshStandardMaterial
			color={resolved.current_color}
			emissive={resolved.current_color}
			emissiveIntensity={resolved.housing_emissive}
			transparent={true}
			opacity={panel_opacity}
		/>
	</T.Mesh>

	<!-- Glowing border frame (top, bottom, left, right bars) -->
	{#each [-1, 1] as side (side)}
		<T.Mesh position={[0, side * BORDER_POS, 0]}>
			<T.BoxGeometry args={[PANEL_SIZE, BORDER_THICKNESS, BORDER_DEPTH]} />
			<T.MeshStandardMaterial
				color={resolved.current_color}
				emissive={resolved.current_color}
				emissiveIntensity={resolved.ring_emissive}
			/>
		</T.Mesh>
		<T.Mesh position={[side * BORDER_POS, 0, 0]}>
			<T.BoxGeometry args={[BORDER_THICKNESS, PANEL_SIZE, BORDER_DEPTH]} />
			<T.MeshStandardMaterial
				color={resolved.current_color}
				emissive={resolved.current_color}
				emissiveIntensity={resolved.ring_emissive}
			/>
		</T.Mesh>
	{/each}

	{#if icon_type === 'cyber'}
		<!-- Outer hexagonal ring -->
		<T.Mesh position.z={CYBER_ICON_Z}>
			<T.TorusGeometry
				args={[CYBER_OUTER_RING_R, CYBER_OUTER_RING_TUBE, CYBER_RING_RADIAL, CYBER_RING_TUBULAR]}
			/>
			<T.MeshStandardMaterial
				color={resolved.current_color}
				emissive={resolved.current_color}
				emissiveIntensity={resolved.ring_emissive}
			/>
		</T.Mesh>
		<!-- Inner hexagonal ring rotated 30° -->
		<T.Mesh position.z={CYBER_ICON_Z} rotation.z={CYBER_INNER_RING_ROTATION}>
			<T.TorusGeometry
				args={[CYBER_INNER_RING_R, CYBER_INNER_RING_TUBE, CYBER_RING_RADIAL, CYBER_RING_TUBULAR]}
			/>
			<T.MeshStandardMaterial
				color={resolved.current_color}
				emissive={resolved.current_color}
				emissiveIntensity={resolved.orb_emissive}
			/>
		</T.Mesh>
		<!-- Center orb -->
		<T.Mesh position.z={CYBER_ICON_Z}>
			<T.SphereGeometry args={[CYBER_ORB_R, CYBER_ORB_SEGMENTS, CYBER_ORB_SEGMENTS]} />
			<T.MeshStandardMaterial
				color={resolved.current_color}
				emissive={resolved.current_color}
				emissiveIntensity={resolved.orb_emissive}
			/>
		</T.Mesh>
	{:else}
		<!-- Fullscreen icon: 4 corner L-brackets -->
		{#each CORNER_BARS as bar (bar.key)}
			<T.Mesh position={[bar.px, bar.py, FULLSCREEN_ICON_Z]}>
				<T.BoxGeometry args={[bar.w, bar.h, CORNER_DEPTH]} />
				<T.MeshStandardMaterial
					color={resolved.current_color}
					emissive={resolved.current_color}
					emissiveIntensity={resolved.orb_emissive}
				/>
			</T.Mesh>
		{/each}
	{/if}

	<!-- Point light for active glow -->
	{#if is_active}
		<T.PointLight
			position.z={ACTIVE_LIGHT_Z}
			color={resolved.current_color}
			intensity={ACTIVE_LIGHT_INTENSITY}
			distance={ACTIVE_LIGHT_DISTANCE}
		/>
	{/if}

	<!-- Invisible hit area for click detection -->
	<T.Mesh position.z={HIT_AREA_Z} {onclick}>
		<T.BoxGeometry args={[HIT_AREA_W, HIT_AREA_H, HIT_AREA_DEPTH]} />
		<T.MeshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
	</T.Mesh>

	<!-- Label below panel -->
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
