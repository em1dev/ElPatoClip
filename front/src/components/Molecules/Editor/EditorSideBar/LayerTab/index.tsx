import * as S from './styles';
import { Layer } from "../../../../../types"
import { ComponentAttributes } from '../types';
import { useState } from 'react';
import { LayerItem } from './LayerItem';

export interface LayerTab extends ComponentAttributes {}

export const LayerTab = ({
  layers,
  onLayersChange,
  selectedLayerId,
  setSelectedLayerId
}: LayerTab) => {
  const [dragLayerId, setDragLayerId] = useState<number | null>(null);

  const updateLayer = (layerId: number, partialLayer: Partial<Layer>) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    onLayersChange([ 
      ...layers.filter(l => l.id !== layer.id),
      {
        ...layer,
        ...partialLayer
      }
    ]);
  }

  return (
    <S.LayerContainer>
      {layers
      .sort((a,b) => b.zIndex - a.zIndex)
      .map((layer) => (
          <LayerItem 
            key={layer.id}
            dragLayerId={dragLayerId}
            layer={layer}
            selectedLayerId={selectedLayerId}
            setDragLayerId={setDragLayerId}
            setSelectedLayerId={setSelectedLayerId}
            updateLayers={onLayersChange}
            updateLayer={updateLayer}
          />
      ))}
    </S.LayerContainer>
  );
}