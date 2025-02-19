import * as S from './styles';
import { useCallback } from 'react';
import { Rect } from '../../../../../../types';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';
import { PropertyInput } from '../PropertyInput';

export const PlacementProperties = () => {
  const selectedLayer = useEditorState(state => state.selectedLayer);
  const updateLayerPartially = useEditorState(state => state.updateLayerPartially);
  const isLocked = selectedLayer?.locked;

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

          <S.Row>
            <PropertyInput
              disabled={isLocked}
              label='X'
              type='number'
              value={selectedLayer.input.rect.x}
              step="1"
              onChange={(e) => { onChange('input', { x: e.target.value }); }}
            />
            <PropertyInput
              disabled={isLocked}
              label="Y"
              type='number'
              value={selectedLayer.input.rect.y}
              step="1"
              onChange={(e) => { onChange('input', { y: e.target.value }); }}
            />
          </S.Row>

          <S.Row>
            <PropertyInput
              disabled={isLocked}
              label='W'
              type='number'
              value={selectedLayer.input.rect.width}
              step='1'
              onChange={(e) => { onChange('input', { width: e.target.value }); }}
            />
            <PropertyInput
              disabled={isLocked}
              label="H"
              type='number'
              value={selectedLayer.input.rect.height}
              step='1'
              onChange={(e) => { onChange('input', { height: e.target.value }); }}
            />
          </S.Row>

        </S.Container>
      </section>

      <section>
        <h2>Output Placement</h2>
        <S.Container>
          <S.Row>
            <PropertyInput
              disabled={isLocked}
              label='X'
              type='number'
              value={selectedLayer.output.rect.x}
              step="1"
              onChange={(e) => { onChange('output', { x: e.target.value }); }}
            />
            <PropertyInput
              disabled={isLocked}
              label="Y"
              type='number'
              value={selectedLayer.output.rect.y}
              step="1"
              onChange={(e) => { onChange('output', { y: e.target.value }); }}
            />
          </S.Row>

          <S.Row>
            <PropertyInput
              disabled={isLocked}
              label='W'
              type='number'
              value={selectedLayer.output.rect.width}
              step='1'
              onChange={(e) => { onChange('output', { width: e.target.value }); }}
            />
            <PropertyInput
              disabled={isLocked}
              label="H"
              type='number'
              value={selectedLayer.output.rect.height}
              step='1'
              onChange={(e) => { onChange('output', { height: e.target.value }); }}
            />
          </S.Row>

        </S.Container>
      </section>
    </>
  );
};