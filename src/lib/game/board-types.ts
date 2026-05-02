export type ButtonColor = 'green' | 'red' | 'yellow' | 'blue';

export interface SimonBoardData {
	active_color: ButtonColor | null;
	pressed_color: ButtonColor | null;
	phase: string;
	round: number;
	flash_colors: readonly ButtonColor[];
	flash_intensity: number;
}
