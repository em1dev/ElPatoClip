export interface CropOptions extends Rect {}

export type Size = { width: number, height: number };
export type Point = { x: number, y: number };

export interface Rect extends Point, Size {}

export type LayerShape = 'circle' | 'round-rectangle' | 'rectangle';

export type LayerFilter = 'blur' | 'none';

export type AspectRatio = 'potrait' | 'landscape' | 'free' | 'locked';

export interface Layer {
  id: number,
  name: string,
  zIndex: number,
  borderColor: string,
  input?: Source | undefined,
  output: Source,
  locked: boolean,
  filter: LayerFilter,
  aspect: AspectRatio,
  shape: LayerShape
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