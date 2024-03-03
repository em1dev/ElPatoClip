import { Layer } from "../../../../types";

export interface ComponentAttributes {
  layers: Array<Layer>,
  onLayerChange: React.Dispatch<React.SetStateAction<Array<Layer>>>,
  selectedLayerId: number | null,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<number | null>>,
}

