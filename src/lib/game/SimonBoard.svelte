<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { simon } from '$lib/simon/simon.svelte';
	import { game_state } from '$lib/game/state.svelte';
	import type { ButtonColor } from '$lib/simon/types';
	import { messages } from '$lib/messages/en';

	const INNER_RADIUS = 0.3;
	const OUTER_RADIUS = 0.7;
	const THETA_SEGMENTS = 32;
	const CIRCLE_SEGMENTS = 32;
	const BACKING_SEGMENTS = 64;
	const BUTTON_GAP = Math.PI / 36;
	const THETA_START = BUTTON_GAP;
	const THETA_LENGTH = Math.PI / 2 - BUTTON_GAP * 2;
	const BACKING_RADIUS = 0.85;
	const CENTER_RADIUS = 0.22;
	const LABEL_Z = 0.02;
	const BACKING_Z = -0.01;
	const MODE_TOGGLE_Y = -1.0;
	const MODE_BOX_W = 0.5;
	const MODE_BOX_H = 0.12;
	const MODE_BOX_D = 0.01;
	const FONT_SIZE = 0.08;
	const EMISSIVE_INTENSITY = 0.8;
	const CYBER_EMISSIVE_INTENSITY = 1.5;
	const BOARD_Y = 1.2;
	const BOARD_Z = -4.8;

	interface ButtonConfig {
		color: ButtonColor;
		rotation: number;
		lit_color: string;
		dim_color: string;
		cyber_lit_color: string;
		cyber_dim_color: string;
	}

	const BUTTON_CONFIGS = [
		{
			color: 'green' as ButtonColor,
			rotation: 0,
			lit_color: '#00ff00',
			dim_color: '#003300',
			cyber_lit_color: '#00ffaa',
			cyber_dim_color: '#005533'
		},
		{
			color: 'red' as ButtonColor,
			rotation: Math.PI / 2,
			lit_color: '#ff2222',
			dim_color: '#330000',
			cyber_lit_color: '#ff0088',
			cyber_dim_color: '#550022'
		},
		{
			color: 'yellow' as ButtonColor,
			rotation: Math.PI,
			lit_color: '#ffff00',
			dim_color: '#333300',
			cyber_lit_color: '#ffff00',
			cyber_dim_color: '#555500'
		},
		{
			color: 'blue' as ButtonColor,
			rotation: -Math.PI / 2,
			lit_color: '#2266ff',
			dim_color: '#001133',
			cyber_lit_color: '#00ccff',
			cyber_dim_color: '#003355'
		}
	] as const satisfies readonly ButtonConfig[];

	function is_lit(color: ButtonColor): boolean {
		return simon.active_color === color || simon.pressed_color === color;
	}

	function btn_lit(btn: ButtonConfig): string {
		return game_state.is_cyber ? btn.cyber_lit_color : btn.lit_color;
	}

	function btn_dim(btn: ButtonConfig): string {
		return game_state.is_cyber ? btn.cyber_dim_color : btn.dim_color;
	}

	function on_press(color: ButtonColor): void {
		simon.press(color);
	}

	function get_center_text(): string {
		if (simon.phase === 'gameover') return messages.simon_gameover;
		if (simon.round > 0) return `${messages.simon_round} ${simon.round}`;
		return messages.simon_start;
	}

	function get_mode_text(): string {
		return simon.mode === 'strict' ? messages.simon_strict : messages.simon_normal;
	}

	let center_text = $derived(get_center_text());
	let mode_text = $derived(get_mode_text());
	let emissive_intensity = $derived(
		game_state.is_cyber ? CYBER_EMISSIVE_INTENSITY : EMISSIVE_INTENSITY
	);
</script>

<T.Group position={[0, BOARD_Y, BOARD_Z]}>
	<T.Mesh position.z={BACKING_Z}>
		<T.CircleGeometry args={[BACKING_RADIUS, BACKING_SEGMENTS]} />
		<T.MeshStandardMaterial color="#111111" roughness={0.8} />
	</T.Mesh>

	{#each BUTTON_CONFIGS as btn (btn.color)}
		<T.Group rotation.z={btn.rotation}>
			<T.Mesh onclick={() => on_press(btn.color)}>
				<T.RingGeometry
					args={[INNER_RADIUS, OUTER_RADIUS, THETA_SEGMENTS, 1, THETA_START, THETA_LENGTH]}
				/>
				{@const lit = btn_lit(btn)}
				{@const dim = btn_dim(btn)}
				{@const active = is_lit(btn.color)}
				<T.MeshStandardMaterial
					color={active ? lit : dim}
					emissive={active ? lit : '#000000'}
					emissiveIntensity={emissive_intensity}
				/>
			</T.Mesh>
		</T.Group>
	{/each}

	<T.Mesh onclick={() => simon.start()}>
		<T.CircleGeometry args={[CENTER_RADIUS, CIRCLE_SEGMENTS]} />
		<T.MeshStandardMaterial color="#222222" roughness={0.5} />
	</T.Mesh>

	<T.Group position={[0, 0, LABEL_Z]}>
		<Text
			text={center_text}
			fontSize={FONT_SIZE}
			color="#ffffff"
			anchorX="center"
			anchorY="middle"
		/>
	</T.Group>

	<T.Mesh position={[0, MODE_TOGGLE_Y, 0]} onclick={() => simon.toggle_mode()}>
		<T.BoxGeometry args={[MODE_BOX_W, MODE_BOX_H, MODE_BOX_D]} />
		<T.MeshStandardMaterial color="#333333" roughness={0.5} />
	</T.Mesh>

	<T.Group position={[0, MODE_TOGGLE_Y, LABEL_Z]}>
		<Text text={mode_text} fontSize={FONT_SIZE} color="#aaaaaa" anchorX="center" anchorY="middle" />
	</T.Group>
</T.Group>
