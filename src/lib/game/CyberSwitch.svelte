<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { game_state } from '$lib/game/state.svelte';
	import { messages } from '$lib/messages/en';
	const SWITCH_X = 4.5;
	const SWITCH_Y = 1.2;
	const SWITCH_Z = 0;
	const BOX_W = 0.4;
	const BOX_H = 0.6;
	const BOX_D = 0.15;
	const LABEL_FONT_SIZE = 0.12;
	const LABEL_Z = 0.1;
	const NORMAL_COLOR = '#00aaff';
	const CYBER_COLOR = '#ff00ff';
	const EMISSIVE_INTENSITY = 0.6;

	function handle_click(): void {
		game_state.toggle_cyber();
	}

	let current_color = $derived(game_state.is_cyber ? CYBER_COLOR : NORMAL_COLOR);
</script>

<T.Group position={[SWITCH_X, SWITCH_Y, SWITCH_Z]}>
	<T.Mesh onclick={handle_click}>
		<T.BoxGeometry args={[BOX_W, BOX_H, BOX_D]} />
		<T.MeshStandardMaterial
			color={current_color}
			emissive={current_color}
			emissiveIntensity={EMISSIVE_INTENSITY}
		/>
	</T.Mesh>
	<T.Group position={[0, 0, LABEL_Z]}>
		<Text
			text={messages.cyber_switch_label}
			fontSize={LABEL_FONT_SIZE}
			color="#ffffff"
			anchorX="center"
			anchorY="middle"
		/>
	</T.Group>
</T.Group>
