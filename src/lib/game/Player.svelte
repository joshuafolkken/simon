<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { T, useTask } from '@threlte/core';
	import { RigidBody, Collider } from '@threlte/rapier';
	import { input } from '$lib/game/input.svelte';

	type RapierBody = NonNullable<ComponentProps<typeof RigidBody>['rigidBody']>;

	const SPAWN_X = 0;
	const SPAWN_Y = 1;
	const SPAWN_Z = 3;
	const HEAD_HEIGHT = 0.6;
	const CAPSULE_HALF_H = 0.5;
	const CAPSULE_RADIUS = 0.4;
	const MOVE_SPEED = 5;
	const FOV = 75;
	const JOYSTICK_LOOK_SPEED = 2;
	let rapier_body: RapierBody | undefined;
	let cam_x = $state(SPAWN_X);
	let cam_y = $state(SPAWN_Y + HEAD_HEIGHT);
	let cam_z = $state(SPAWN_Z);

	function compute_velocity(): { x: number; y: number; z: number } {
		const fw_x = -Math.sin(input.yaw);
		const fw_z = -Math.cos(input.yaw);
		const rt_x = Math.cos(input.yaw);
		const rt_z = -Math.sin(input.yaw);
		const w = (input.keys.w ? 1 : 0) - (input.keys.s ? 1 : 0) + input.joystick_move.y;
		const d = (input.keys.d ? 1 : 0) - (input.keys.a ? 1 : 0) + input.joystick_move.x;
		const vx = fw_x * w + rt_x * d;
		const vz = fw_z * w + rt_z * d;
		const len = Math.sqrt(vx * vx + vz * vz);
		const nx = len > 1 ? vx / len : vx;
		const nz = len > 1 ? vz / len : vz;
		return { x: nx * MOVE_SPEED, y: 0, z: nz * MOVE_SPEED };
	}

	function tick(delta: number): void {
		if (!rapier_body) return;
		const vel = compute_velocity();
		const pos = rapier_body.translation();
		rapier_body.setNextKinematicTranslation({
			x: pos.x + vel.x * delta,
			y: SPAWN_Y,
			z: pos.z + vel.z * delta
		});
		cam_x = pos.x;
		cam_y = SPAWN_Y + HEAD_HEIGHT;
		cam_z = pos.z;
		if (input.joystick_look.x || input.joystick_look.y) {
			input.apply_look_delta(
				input.joystick_look.x * JOYSTICK_LOOK_SPEED * delta,
				input.joystick_look.y * JOYSTICK_LOOK_SPEED * delta
			);
			input.set_joystick_look(0, 0);
		}
	}

	useTask(tick);
</script>

<!-- Physics capsule at spawn position -->
<T.Group position={[SPAWN_X, SPAWN_Y, SPAWN_Z]}>
	<RigidBody
		type="kinematicPosition"
		lockRotations
		oncreate={(body) => {
			rapier_body = body;
		}}
	>
		<Collider shape="capsule" args={[CAPSULE_HALF_H, CAPSULE_RADIUS]} />
	</RigidBody>
</T.Group>

<!-- Camera follows physics position, rotates with yaw+pitch -->
<T.Group position={[cam_x, cam_y, cam_z]} rotation.y={input.yaw}>
	<T.Group rotation.x={input.pitch}>
		<T.PerspectiveCamera makeDefault fov={FOV} near={0.1} far={50} />
	</T.Group>
</T.Group>
