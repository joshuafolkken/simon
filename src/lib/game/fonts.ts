const FONT_RETRO = '/fonts/PressStart2P.ttf';
const FONT_CYBER = '/fonts/Orbitron.ttf';
const FONT_FAMILY_RETRO = 'PressStart2P';
const FONT_FAMILY_CYBER = 'Orbitron';
const RETRO_FONT_SIZE_MULTIPLIER = 0.8;
const CYBER_FONT_SIZE_MULTIPLIER = 1;

function get_font(is_cyber: boolean): string {
	return is_cyber ? FONT_CYBER : FONT_RETRO;
}

function get_font_family(is_cyber: boolean): string {
	return is_cyber ? FONT_FAMILY_CYBER : FONT_FAMILY_RETRO;
}

function get_font_size_multiplier(is_cyber: boolean): number {
	return is_cyber ? CYBER_FONT_SIZE_MULTIPLIER : RETRO_FONT_SIZE_MULTIPLIER;
}

export const fonts = {
	get_font,
	get_font_family,
	get_font_size_multiplier,
	FONT_RETRO,
	FONT_CYBER,
	FONT_FAMILY_RETRO,
	FONT_FAMILY_CYBER,
	RETRO_FONT_SIZE_MULTIPLIER,
	CYBER_FONT_SIZE_MULTIPLIER
};
