<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { messages } from '$lib/messages/en';

	const CAMERA_Z = 5;
	const TITLE_Y = 1;
	const START_Y = -1;
	const BOB_SPEED = 0.001;
	const BOB_AMPLITUDE = 0.1;
	const TORUS_RADIUS = 0.5;
	const TORUS_TUBE = 0.08;
	const TORUS_SEGMENTS = 16;
	const TORUS_RING_SEGMENTS = 100;
	const ROTATION_SPEED = 0.3;
	const TITLE_FONT_SIZE = 1.2;
	const START_FONT_SIZE = 0.3;
	const START_TEXT_Z = 0.15;
	const EMISSIVE_INTENSITY = 0.8;
	const AMBIENT_INTENSITY = 0.4;
	const DIR_LIGHT_INTENSITY = 1;
	const FOV = 60;
	const START_COLOR = '#00ff88';
	const START_EMISSIVE_COLOR = '#006633';

	let title_y = $state(TITLE_Y);
	let torus_rotation_z = $state(0);

	function tick(delta: number): void {
		title_y = TITLE_Y + Math.sin(Date.now() * BOB_SPEED) * BOB_AMPLITUDE;
		torus_rotation_z += ROTATION_SPEED * delta;
	}

	useTask(tick);
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z]} fov={FOV} />
<T.AmbientLight intensity={AMBIENT_INTENSITY} />
<T.DirectionalLight position={[5, 5, 5]} intensity={DIR_LIGHT_INTENSITY} />

<T.Group position.y={title_y}>
	<Text
		text={messages.game_title}
		fontSize={TITLE_FONT_SIZE}
		color="#ffffff"
		anchorX="center"
		anchorY="middle"
	/>
</T.Group>

<T.Group position={[0, START_Y, 0]}>
	<T.Mesh rotation.z={torus_rotation_z}>
		<T.TorusGeometry args={[TORUS_RADIUS, TORUS_TUBE, TORUS_SEGMENTS, TORUS_RING_SEGMENTS]} />
		<T.MeshStandardMaterial
			color={START_COLOR}
			emissive={START_EMISSIVE_COLOR}
			emissiveIntensity={EMISSIVE_INTENSITY}
		/>
	</T.Mesh>
	<T.Group position={[0, 0, START_TEXT_Z]}>
		<Text
			text={messages.press_start}
			fontSize={START_FONT_SIZE}
			color={START_COLOR}
			anchorX="center"
			anchorY="middle"
		/>
	</T.Group>
</T.Group>
