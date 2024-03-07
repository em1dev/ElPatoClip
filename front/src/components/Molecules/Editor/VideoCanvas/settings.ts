import { Size } from "../../../../types";

export type VideoDirection = 'portrait' | 'landscape';

export const MIN_CROP_SIZE = 100;
export const RESIZE_HANLDER_RADIUS = 8;
export const CANVAS_PADDING = 30;
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