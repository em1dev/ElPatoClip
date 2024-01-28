export interface CropOptions extends Rect {}

export type Size = { width: number, height: number };
export type Point = { x: number, y: number };

export interface Rect extends Point, Size {}

export interface Layer {
  id: number,
  zIndex: number,
  borderColor: string,
  input?: Source | undefined,
  output: Source
}

export interface Source {
  rect: Rect
}

export interface TimeSlice {
  /**
   * In seconds
   */
  startTime: number,

  /**
   * In seconds
   */
  endTime: number
}