<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';

	const ROOM_W = 10;
	const ROOM_D = 10;
	const ROOM_H = 3;
	const HALF_W = ROOM_W / 2;
	const HALF_D = ROOM_D / 2;
	const WALL_THICK = 0.1;
	const FLOOR_COLOR = '#3a2f2f';
	const WALL_COLOR = '#4a4a5a';
	const CEILING_COLOR = '#2a2a3a';
</script>

<!-- Static physics for walls (floor excluded: player y is fixed) -->
<RigidBody type="fixed">
	<!-- Left wall -->
	<T.Group position={[-HALF_W - WALL_THICK, ROOM_H / 2, 0]}>
		<Collider shape="cuboid" args={[WALL_THICK, ROOM_H / 2, HALF_D]} />
	</T.Group>
	<!-- Right wall -->
	<T.Group position={[HALF_W + WALL_THICK, ROOM_H / 2, 0]}>
		<Collider shape="cuboid" args={[WALL_THICK, ROOM_H / 2, HALF_D]} />
	</T.Group>
	<!-- Back wall -->
	<T.Group position={[0, ROOM_H / 2, -HALF_D - WALL_THICK]}>
		<Collider shape="cuboid" args={[HALF_W, ROOM_H / 2, WALL_THICK]} />
	</T.Group>
	<!-- Front wall -->
	<T.Group position={[0, ROOM_H / 2, HALF_D + WALL_THICK]}>
		<Collider shape="cuboid" args={[HALF_W, ROOM_H / 2, WALL_THICK]} />
	</T.Group>
</RigidBody>

<!-- Floor -->
<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_D]} />
	<T.MeshStandardMaterial color={FLOOR_COLOR} roughness={0.9} />
</T.Mesh>

<!-- Ceiling -->
<T.Mesh position.y={ROOM_H} rotation.x={Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_D]} />
	<T.MeshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
</T.Mesh>

<!-- Left wall mesh -->
<T.Mesh position={[-HALF_W, ROOM_H / 2, 0]} rotation.y={Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_D, ROOM_H]} />
	<T.MeshStandardMaterial color={WALL_COLOR} roughness={0.8} />
</T.Mesh>

<!-- Right wall mesh -->
<T.Mesh position={[HALF_W, ROOM_H / 2, 0]} rotation.y={-Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[ROOM_D, ROOM_H]} />
	<T.MeshStandardMaterial color={WALL_COLOR} roughness={0.8} />
</T.Mesh>

<!-- Back wall mesh -->
<T.Mesh position={[0, ROOM_H / 2, -HALF_D]} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_H]} />
	<T.MeshStandardMaterial color={WALL_COLOR} roughness={0.8} />
</T.Mesh>

<!-- Front wall mesh -->
<T.Mesh position={[0, ROOM_H / 2, HALF_D]} rotation.y={Math.PI} receiveShadow>
	<T.PlaneGeometry args={[ROOM_W, ROOM_H]} />
	<T.MeshStandardMaterial color={WALL_COLOR} roughness={0.8} />
</T.Mesh>
