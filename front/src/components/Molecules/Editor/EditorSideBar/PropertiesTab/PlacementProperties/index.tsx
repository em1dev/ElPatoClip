import * as S from './styles';
import { useCallback } from 'react';
import { Input } from '../../../../../Atoms/Input';
import { Rect } from '../../../../../../types';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';

export const PlacementProperties = () => {
  const selectedLayer = useEditorState(state => state.selectedLayer);
  const updateLayerPartially = useEditorState(state => state.updateLayerPartially);

  const onChange = useCallback((selector: 'input' | 'output', rect: {
    x?: string,
    y?: string,
    width?: string,
    height?: string
  }) => {
    if (!selectedLayer) return;

    const layerSelected = selectedLayer[selector];
    if (!layerSelected) return;

    const prevRect = { ...layerSelected.rect };

    for (const key of Object.keys(rect)) {
      const value = rect[key as keyof Rect];
      if (!value) continue;
      const valueAsInt = parseInt(value);
      if (isNaN(valueAsInt)) continue;
      prevRect[key as keyof Rect] = valueAsInt;
    }

    updateLayerPartially(selectedLayer.id, {
      [selector]: {
        ...layerSelected,
        rect: prevRect, 
      }
    });
  }, [updateLayerPartially, selectedLayer]);

  if (!selectedLayer || !selectedLayer.input) return;

  return (
    <>
      <section>
        <h2>Input Placement</h2>
        <S.Container>
          <S.PropertyRow>
            <span>X</span>
            <Input
              size='sm'
              value={selectedLayer.input.rect.x}
              type='number'
              onChange={(e) => {
                onChange('input', { x: e.target.value });
              }}
            />
            <span>Y</span>
            <Input
              size='sm'
              value={selectedLayer.input.rect.y}
              type='number'
              onChange={(e) => {
                onChange('input', { y: e.target.value });
              }}
            />
          </S.PropertyRow>

          <S.PropertyRow>
            <span>W</span>
            <Input
              size='sm'
              value={selectedLayer.input.rect.width}
              type='number'
              onChange={(e) => {
                onChange('input', { width: e.target.value });
              }}
            />
            <span>H</span>
            <Input
              size='sm'
              value={selectedLayer.input.rect.height}
              type='number'
              onChange={(e) => {
                onChange('input', { height: e.target.value });
              }}
            />
          </S.PropertyRow>
        </S.Container>
      </section>
      <section>
        <h2>Output Placement</h2>
        <S.Container>
          <S.PropertyRow>
            <span>X</span>
            <Input
              size='sm'
              value={selectedLayer.output.rect.x}
              type='number'
              onChange={(e) => {
                onChange('output', { x: e.target.value });
              }}
            />
            <span>Y</span>
            <Input
              size='sm'
              value={selectedLayer.output.rect.y}
              type='number'
              onChange={(e) => {
                onChange('output', { y: e.target.value });
              }}
            />
          </S.PropertyRow>

          <S.PropertyRow>
            <span>W</span>
            <Input
              size='sm'
              value={selectedLayer.output.rect.width}
              type='number'
              onChange={(e) => {
                onChange('output', { width: e.target.value });
              }}
            />
            <span>H</span>
            <Input
              size='sm'
              value={selectedLayer.output.rect.height}
              type='number'
              onChange={(e) => {
                onChange('output', { height: e.target.value });
              }}
            />
          </S.PropertyRow>
        </S.Container>   
      </section>
    </>
  );
};