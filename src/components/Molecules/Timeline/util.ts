export const secondsToPixels = (value: number) => (
  value * (50 / 2)
);

export const pixelsToSeconds = (value: number) => (
  value / (50 / 2)
);

export const scruberOffset = {
  left: 31,
  right: 31 + 7,
};

export const layerOffset = {
  left: 20,
  right: 10,
}

export const MIN_VIDEO_LENGTH = 10;
