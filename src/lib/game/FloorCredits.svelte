<script lang="ts">
	import { Text } from '@threlte/extras';
	import { useTask } from '@threlte/core';
	import { fonts } from '$lib/game/fonts';
	import { game_state } from '$lib/game/state.svelte';
	import {
		CREDITS_FONT_SIZE,
		CREDITS_LINE_HEIGHT,
		CREDITS_NORMAL_COLOR,
		CREDITS_CYBER_COLOR,
		CREDITS_POSITION_Y,
		CREDITS_SCROLL_START_Z,
		CREDITS_GLOW_BLUR,
		CREDITS_GLOW_OPACITY,
		FLOOR_TEXT_ROTATION_X,
		CREDITS_TEXT
	} from './credits-config';
	import { advance_scroll } from './credits-scroll';

	let is_cyber = $derived(game_state.is_cyber);
	let current_font = $derived(fonts.get_font(is_cyber));
	let color = $derived(is_cyber ? CREDITS_CYBER_COLOR : CREDITS_NORMAL_COLOR);
	let scroll_z = $state(CREDITS_SCROLL_START_Z);

	function tick(delta: number): void {
		scroll_z = advance_scroll(scroll_z, delta);
	}

	useTask(tick);
</script>

<Text
	text={CREDITS_TEXT}
	font={current_font}
	fontSize={CREDITS_FONT_SIZE}
	lineHeight={CREDITS_LINE_HEIGHT}
	textAlign="center"
	{color}
	anchorX="center"
	anchorY="middle"
	outlineColor={color}
	outlineBlur={CREDITS_GLOW_BLUR}
	outlineOpacity={CREDITS_GLOW_OPACITY}
	position={[0, CREDITS_POSITION_Y, scroll_z]}
	rotation={[FLOOR_TEXT_ROTATION_X, 0, 0]}
/>
