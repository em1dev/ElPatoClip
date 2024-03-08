import { Layer } from "../../../../../types";

export type PropertyTabInterface = {
  updateLayer: (id: number, layer: Partial<Layer>) => void,
  layer: Layer
}