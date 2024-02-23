import * as S from './styles';
import { Dispatch, SetStateAction, useCallback } from "react"
import { Layer } from "../../../../../types"
import { LayerConfiguration } from "./LayerConfiguration"
import { ButtonIcon } from '../../../../Atoms/ButtonIcon';
import { addNewLayer } from '../../../../../Utils/LayerGenerator';

export interface LayerEditorProps {
  layers: Array<Layer>,
  setLayer: Dispatch<SetStateAction<Array<Layer>>>,
}

export const LayerEditor = ({
  layers,
  setLayer
}: LayerEditorProps) => {

  const onLayerChange = useCallback((layer: Layer) => {
    setLayer((prev) => ([
      ...prev.filter(f => f.id !== layer.id),
      layer
    ]));
  }, [setLayer]);

  const onNewLayerPressed = useCallback(() => {
    setLayer(addNewLayer);
  }, [setLayer]);

  const onLayerIndexIncrease = useCallback((layer: Layer) => {
    setLayer((prev) => {
      let sortedList = prev.sort((a, b) => a.zIndex - b.zIndex);
      sortedList = sortedList.map(item => item.id === layer.id ? {
        ...item,
        zIndex: Math.min(item.zIndex + 1, prev.length - 1)
      } : item);
      const toReduce = sortedList[layer.zIndex + 1];
      if (toReduce) {
        toReduce.zIndex = Math.max(toReduce.zIndex - 1, 0);
      }
      return sortedList;
    });
  }, [setLayer]);

  const onLayerIndexDecrease = useCallback((layer: Layer) => {
    setLayer((prev) => {
      let sortedList = prev.sort((a, b) => a.zIndex - b.zIndex);
      sortedList = sortedList.map(item => item.id === layer.id ? {
        ...item,
        zIndex: Math.max(item.zIndex - 1, 0)
      } : item);
      const toIncrease = sortedList[layer.zIndex - 1];
      if (toIncrease) {
        toIncrease.zIndex = Math.min(toIncrease.zIndex + 1, prev.length - 1);
      }
      return sortedList;
    });
  }, [setLayer]);

  return (
    <S.Container>
      <h2>Layers</h2>
      {
        layers
          .sort((a, b) => b.zIndex - a.zIndex)
          .map(layer => (
            <LayerConfiguration
              onDelete={() => setLayer(prev => prev.filter(l => l.id !== layer.id))}
              key={layer.id}
              layer={layer}
              onChange={onLayerChange}
              onOrderDecrease={
                layer.zIndex === 0 ? undefined :
                () => onLayerIndexDecrease(layer)
              }
              onOrderIncrease={
                layer.zIndex === layers.length - 1 ? undefined :
                () => onLayerIndexIncrease(layer)
              }
            />
          ))
      }
      <ButtonIcon onClick={onNewLayerPressed} alt='add layer' iconName='MingcuteAddCircleFill.svg' />
    </S.Container>
  )

}