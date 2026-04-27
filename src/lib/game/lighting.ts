const AMBIENT_INTENSITY = 1.5;
const CYBER_AMBIENT_INTENSITY = 2.5;
const POINT_LIGHT_INTENSITY = 20;
const CYBER_POINT_LIGHT_INTENSITY = 35;
const AMBIENT_COLOR_NORMAL = '#ffffff';
const AMBIENT_COLOR_CYBER = '#6060ff';

function get_ambient_intensity(is_cyber: boolean): number {
	return is_cyber ? CYBER_AMBIENT_INTENSITY : AMBIENT_INTENSITY;
}

function get_point_light_intensity(is_cyber: boolean): number {
	return is_cyber ? CYBER_POINT_LIGHT_INTENSITY : POINT_LIGHT_INTENSITY;
}

function get_ambient_color(is_cyber: boolean): string {
	return is_cyber ? AMBIENT_COLOR_CYBER : AMBIENT_COLOR_NORMAL;
}

export const lighting = {
	get_ambient_intensity,
	get_point_light_intensity,
	get_ambient_color,
	AMBIENT_INTENSITY,
	CYBER_AMBIENT_INTENSITY,
	POINT_LIGHT_INTENSITY,
	CYBER_POINT_LIGHT_INTENSITY,
	AMBIENT_COLOR_NORMAL,
	AMBIENT_COLOR_CYBER
};
