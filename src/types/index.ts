export interface CropOptions extends Rect {}

export type Size = { width: number, height: number };
export type Point = { x: number, y: number };

export interface Rect extends Point, Size {}

export interface Layer {
  outlineColor: string,
  src: Source,
  output: Source
}

export interface Source {
  rect: Rect
}