import { StateCreator } from 'zustand';
import { Layer, TimeSlice, VisibleCanvas } from '../../types';
import { defaultLayers } from '../../Utils/LayerGenerator';
import { VideoStateSlice } from './useVideoStateSlice';
import { MathUtils } from '../../Utils/MathUtils';

export interface VideoEditSlice {
  selectedVisibleCanvas: VisibleCanvas,
  setSelectedVisibleCanvas: (canvas: VisibleCanvas) => void,
  id: string | null,
  videoMetadata: {
    currentTime: number,
    totalTime: number
  },
  videoBlobUrl: string | null,
  timeSlice: TimeSlice,
  layers: Array<Layer>,
  hoveredLayer: Layer | null,
  setHoveredLayer: (id: number | null) => void,
  selectedLayer: Layer | null,
  setSelectedLayer: (id: number | null) => void,
  setClipId: (
    id: string | null,
    blobUrl: string | null
  ) => void,
  setTimeSlice: (timeSlice: TimeSlice) => void,
  setLayers: (layers: Array<Layer>) => void,
  updateLayerPartially: (id: number, layer: Partial<Layer>) => void,
  setVideoCurrentTime: (time: number) => void,
  setVideoTotalTime: (time: number) => void,
  resetInteractions: () => void,
  isExporting: boolean,
  setIsExporting: (value: boolean) => void,
}

export const useEditStateSlice:StateCreator<
  VideoStateSlice & VideoEditSlice ,
  [],
  [],
  VideoEditSlice
> = (set, get) => ({
  id: null,
  selectedVisibleCanvas: 'both',
  videoMetadata: {
    currentTime: 0,
    totalTime: 0,
  },
  videoBlobUrl: null,
  timeSlice: { endTime: 0, startTime: 0 },
  layers: defaultLayers,
  hoveredLayer: null,
  setSelectedVisibleCanvas: (canvas) => set(() => ({ selectedVisibleCanvas: canvas })),
  setHoveredLayer: (id) => {
    if (id === (get().hoveredLayer?.id ?? null)) return;

    set((prev) => ({
      hoveredLayer: prev.layers.find(layer => layer.id === id) ?? null
    }));
  },
  selectedLayer: null,
  setSelectedLayer: (id) => set((prev) => ({
    selectedLayer: prev.layers.find(layer => layer.id === id) ?? null
  })),
  setTimeSlice: (timeSlice) => {
    const video = get().videoRef?.current;
    if (video) {
      const newTime = MathUtils.clamp(video.currentTime, timeSlice.startTime, timeSlice.endTime);
      if (video.currentTime !== newTime) {
        video.currentTime = newTime;
      }
    }

    set(() => ({ timeSlice }));
  },
  setClipId: (id, blobUrl) => set((() => ({ id, videoBlobUrl: blobUrl }))),
  setLayers: (layers) => (
    set(({ hoveredLayer, selectedLayer}) => ({ 
      layers,
      selectedLayer: layers.find(l => l.id === selectedLayer?.id) ?? null,
      hoveredLayer: layers.find(l => l.id === hoveredLayer?.id) ?? null
    }))
  ),
  updateLayerPartially: (id, partialLayer) => {
    const { selectedLayer, hoveredLayer, layers } = get();
    const newLayers = layers.map((layer) => ( layer.id !== id ? layer : { ...layer, ...partialLayer }));

    if (selectedLayer?.id === id) {
      set({ selectedLayer: newLayers.find(l => l.id === selectedLayer?.id) ?? null });
    }

    if (hoveredLayer?.id === id) [
      set({ hoveredLayer: layers.find(l => l.id === hoveredLayer?.id) ?? null
      })
    ];

    set(() => ({ layers: newLayers }));
  },
  setVideoCurrentTime: (time: number) => {
    if (get().videoMetadata.currentTime === time) return;
    set((prev) => ({ videoMetadata: { ...prev.videoMetadata, currentTime: time } }));
  },
  setVideoTotalTime: (time: number) => {
    const { videoMetadata, timeSlice } = get();
    if (time === videoMetadata.totalTime) return;

    if (timeSlice.endTime === 0 || timeSlice.endTime > time) {
      set(() => ({
        timeSlice: { startTime: 0, endTime: time },
      }));
    }

    set((prev) => ({ 
      videoMetadata: { ...prev.videoMetadata, totalTime: time } 
    }));
  },
  resetInteractions: () => {
    set(() => ({
      selectedLayer: null,
      hoveredLayer: null,
    }));
  },
  isExporting: false,
  setIsExporting: (value) => set(() => ({ isExporting: value }))
});
