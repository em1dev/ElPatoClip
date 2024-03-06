import { Size } from "../../../../types";

export type VideoDirection = 'portrait' | 'landscape';

export const MIN_CROP_SIZE = 100;
export const RESIZE_HANLDER_RADIUS = 15;
export const CANVAS_PADDING = 25;
export const VIDEO_RESOLUTIONS: Record<VideoDirection, Size> = {
  landscape: {
    width: 1920,
    height: 1080,
  },
  portrait: {
    width: 1080,
    height: 1920,
  }
}