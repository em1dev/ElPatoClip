import * as S from './styles';
import { ComponentAttributes } from '../types';
import { LayerProperties } from './LayerProperties';
import { PlacementProperties } from './PlacementProperties';
import { useCallback, useMemo } from 'react';
import { Layer } from '../../../../../types';

export interface PropertiesTabProps extends ComponentAttributes {}

export const PropertiesTab = (props: PropertiesTabProps) => {

  const selectedLayer = useMemo(() => (
    props.layers.find(l => l.id === props.selectedLayerId)
  ), [props.layers, props.selectedLayerId]);

  const onLayerChange = useCallback((id: number, layer: Partial<Layer>) => {
    props.onLayersChange((prev) => prev.map(l => (
      l.id !== id ? l : {
        ...l,
        ...layer
      }
    )));
  }, [props]);

  if (!selectedLayer) {
    return null;
  }

  return (
    <S.Tab>
      <PlacementProperties layer={selectedLayer} updateLayer={onLayerChange} />
      <LayerProperties layer={selectedLayer} updateLayer={onLayerChange} />
    </S.Tab>
  );
};