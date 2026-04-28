<script lang="ts">
	import { T } from '@threlte/core';
	import { game_state } from '$lib/game/state.svelte';
	import { ROOM_W, ROOM_D, ROOM_H, HALF_W, HALF_D } from '$lib/game/room-config';
	const FLOOR_COLOR = '#3a2f2f';
	const WALL_COLOR = '#4a4a5a';
	const CEILING_COLOR = '#2a2a3a';
	const CYBER_FLOOR_COLOR = '#0d2525';
	const CYBER_WALL_COLOR = '#0a2035';
	const CYBER_CEILING_COLOR = '#08082a';

	let floor_color = $derived(game_state.is_cyber ? CYBER_FLOOR_COLOR : FLOOR_COLOR);
	let wall_color = $derived(game_state.is_cyber ? CYBER_WALL_COLOR : WALL_COLOR);
	let ceiling_color = $derived(game_state.is_cyber ? CYBER_CEILING_COLOR : CEILING_COLOR);
</script>

<!-- Floor -->
<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_D]} />
	<T.MeshStandardMaterial color={floor_color} roughness={0.9} />
</T.Mesh>

<!-- Ceiling -->
<T.Mesh position.y={ROOM_H} rotation.x={Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_D]} />
	<T.MeshStandardMaterial color={ceiling_color} roughness={0.9} />
</T.Mesh>

<!-- Left wall mesh -->
<T.Mesh position={[-HALF_W, ROOM_H / 2, 0]} rotation.y={Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_D, ROOM_H]} />
	<T.MeshStandardMaterial color={wall_color} roughness={0.8} />
</T.Mesh>

<!-- Right wall mesh -->
<T.Mesh position={[HALF_W, ROOM_H / 2, 0]} rotation.y={-Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_D, ROOM_H]} />
	<T.MeshStandardMaterial color={wall_color} roughness={0.8} />
</T.Mesh>

<!-- Back wall mesh -->
<T.Mesh position={[0, ROOM_H / 2, -HALF_D]} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_H]} />
	<T.MeshStandardMaterial color={wall_color} roughness={0.8} />
</T.Mesh>

<!-- Front wall mesh -->
<T.Mesh position={[0, ROOM_H / 2, HALF_D]} rotation.y={Math.PI} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_H]} />
	<T.MeshStandardMaterial color={wall_color} roughness={0.8} />
</T.Mesh>
