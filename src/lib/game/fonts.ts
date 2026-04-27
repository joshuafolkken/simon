const FONT_RETRO = 'https://fonts.gstatic.com/s/pressstart2p/v15/ZLfdm8dIPQ0YJQSIFYlE.ttf';
const FONT_CYBER = 'https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.ttf';

function get_font(is_cyber: boolean): string {
	return is_cyber ? FONT_CYBER : FONT_RETRO;
}

export const fonts = { get_font, FONT_RETRO, FONT_CYBER };
