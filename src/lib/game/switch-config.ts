export type SwitchIconType = 'cyber' | 'fullscreen';
export const SWITCH_ICON_TYPES: readonly SwitchIconType[] = ['cyber', 'fullscreen'];

export const SWITCH_Y = 1.2;
// 2x the score display wall distance: back wall=-5, score display=-4.65, distance=0.35, 2x=0.70
export const SWITCH_Z = -4.3;

export const PANEL_SIZE = 0.58;
export const PANEL_HALF = PANEL_SIZE / 2;
export const PANEL_DEPTH = 0.02;
export const PANEL_OPACITY_ACTIVE = 0.18;
export const PANEL_OPACITY_INACTIVE = 0.05;

export const BORDER_THICKNESS = 0.018;
export const BORDER_THICKNESS_HALF = BORDER_THICKNESS / 2;
export const BORDER_DEPTH = 0.025;
export const BORDER_POS = PANEL_HALF - BORDER_THICKNESS_HALF;

export const CYBER_OUTER_RING_R = 0.22;
export const CYBER_OUTER_RING_TUBE = 0.016;
export const CYBER_INNER_RING_R = 0.14;
export const CYBER_INNER_RING_TUBE = 0.011;
export const CYBER_RING_RADIAL = 8;
export const CYBER_RING_TUBULAR = 6;
export const CYBER_INNER_RING_ROTATION = Math.PI / 6;
export const CYBER_ORB_R = 0.045;
export const CYBER_ORB_SEGMENTS = 12;
export const CYBER_ICON_Z = 0.015;

export const CORNER_ARM = 0.1;
export const CORNER_ARM_HALF = CORNER_ARM / 2;
export const CORNER_THICKNESS = 0.015;
export const CORNER_DEPTH = 0.018;
export const CORNER_POS = 0.18;
export const CORNER_ARM_CENTER = CORNER_POS - CORNER_ARM_HALF;
export const FULLSCREEN_ICON_Z = 0.015;

export const HIT_AREA_W = PANEL_SIZE + 0.12;
export const HIT_AREA_H = PANEL_SIZE + 0.12;
export const HIT_AREA_DEPTH = 0.01;
export const HIT_AREA_Z = 0.06;

export const LABEL_FONT_SIZE = 0.1;
export const LABEL_Y_OFFSET = 0.47;
export const LABEL_Z = 0.05;

export const ACTIVE_LIGHT_Z = 0.5;
export const ACTIVE_LIGHT_DISTANCE = 2.5;
export const ACTIVE_LIGHT_INTENSITY = 2.5;
