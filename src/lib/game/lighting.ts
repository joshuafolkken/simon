const AMBIENT_INTENSITY = 0.3;
const CYBER_AMBIENT_INTENSITY = 2.5;
const POINT_LIGHT_INTENSITY = 8;
const CYBER_POINT_LIGHT_INTENSITY = 35;

function get_ambient_intensity(is_cyber: boolean): number {
	return is_cyber ? CYBER_AMBIENT_INTENSITY : AMBIENT_INTENSITY;
}

function get_point_light_intensity(is_cyber: boolean): number {
	return is_cyber ? CYBER_POINT_LIGHT_INTENSITY : POINT_LIGHT_INTENSITY;
}

export const lighting = {
	get_ambient_intensity,
	get_point_light_intensity,
	AMBIENT_INTENSITY,
	CYBER_AMBIENT_INTENSITY,
	POINT_LIGHT_INTENSITY,
	CYBER_POINT_LIGHT_INTENSITY
};
