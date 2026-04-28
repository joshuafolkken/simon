<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { input } from '$lib/game/input.svelte';
	import { player_bounds } from '$lib/game/player-bounds';
	import { player_velocity } from '$lib/game/player-velocity';
	import { player_jump } from '$lib/game/player-jump';

	const SPAWN_X = 0;
	const SPAWN_Y = 1;
	const SPAWN_Z = 3;
	const HEAD_HEIGHT = 0.6;
	const FOV = 75;
	const NEAR_PLANE = 0.1;
	const FAR_PLANE = 50;
	const JOYSTICK_LOOK_SPEED = 2;

	let pos_x = $state(SPAWN_X);
	let pos_y = $state(SPAWN_Y);
	let pos_z = $state(SPAWN_Z);
	let jump_vel_y = 0;

	function get_axis_input(): { forward: number; strafe: number } {
		const forward = (input.keys.w ? 1 : 0) - (input.keys.s ? 1 : 0) + input.joystick_move.y;
		const strafe = (input.keys.d ? 1 : 0) - (input.keys.a ? 1 : 0) + input.joystick_move.x;
		return { forward, strafe };
	}

	function apply_movement(vel_x: number, vel_z: number, delta: number): void {
		const raw_x = pos_x + vel_x * delta;
		const raw_z = pos_z + vel_z * delta;
		const clamped = player_bounds.clamp_to_room(raw_x, raw_z);
		pos_x = clamped.x;
		pos_z = clamped.z;
	}

	function apply_jump_step(delta: number): void {
		const result = player_jump.step_jump({
			vel_y: jump_vel_y,
			pos_y,
			delta,
			is_jump_requested: input.is_jump_requested,
			ground_y: SPAWN_Y
		});
		if (result.jump_consumed) input.clear_jump_request();
		jump_vel_y = result.new_vel_y;
		pos_y = result.new_pos_y;
	}

	function apply_joystick_look(delta: number): void {
		if (!input.joystick_look.x && !input.joystick_look.y) return;
		input.apply_look_delta(
			input.joystick_look.x * JOYSTICK_LOOK_SPEED * delta,
			input.joystick_look.y * JOYSTICK_LOOK_SPEED * delta
		);
		input.set_joystick_look(0, 0);
	}

	function tick(delta: number): void {
		const { forward, strafe } = get_axis_input();
		const vel = player_velocity.compute_velocity({
			yaw: input.yaw,
			forward,
			strafe,
			is_sprinting: input.is_sprinting
		});
		apply_movement(vel.x, vel.z, delta);
		apply_jump_step(delta);
		apply_joystick_look(delta);
	}

	useTask(tick);
</script>

<T.Group position={[pos_x, pos_y + HEAD_HEIGHT, pos_z]} rotation.y={input.yaw}>
	<T.Group rotation.x={input.pitch}>
		<T.PerspectiveCamera makeDefault fov={FOV} near={NEAR_PLANE} far={FAR_PLANE} />
	</T.Group>
</T.Group>
