const FONT_RETRO = '/fonts/PressStart2P.ttf';
const FONT_CYBER = '/fonts/Orbitron.ttf';

function get_font(is_cyber: boolean): string {
	return is_cyber ? FONT_CYBER : FONT_RETRO;
}

export const fonts = { get_font, FONT_RETRO, FONT_CYBER };
