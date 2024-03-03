import { ComponentAttributes } from "../../types";

export interface PlacementProperties extends ComponentAttributes {}

export const PlacementProperties = ({
  layers,
  selectedLayerId,
}: PlacementProperties) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  if (!selectedLayer) return null;

  return (
    <div>
      <h3>Input Placement</h3>
      <div>
        <span>X {selectedLayer.input?.rect.x} </span>
        <span>Y {selectedLayer.input?.rect.y} </span>
      </div>

      <div>
        <span>W {selectedLayer.input?.rect.width} </span>
        <span>H {selectedLayer.input?.rect.height} </span>
      </div>
      <h3>Output Placement</h3>
      <div>
        <span>X {selectedLayer.output.rect.x} </span>
        <span>Y {selectedLayer.output.rect.y} </span>
      </div>

      <div>
        <span>W {selectedLayer.output.rect.width} </span>
        <span>H {selectedLayer.output.rect.height} </span>
      </div>
    </div>
  )
}