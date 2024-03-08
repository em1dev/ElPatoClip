import * as S from './styles';
import { useCallback } from "react";
import { Input } from "../../../../../Atoms/Input";
import { PropertyTabInterface } from "../type";
import { Rect } from "../../../../../../types";

export interface PlacementPropertiesProps extends PropertyTabInterface {}

export const PlacementProperties = ({
  layer, updateLayer
}: PlacementPropertiesProps) => {

  const onChange = useCallback((selector: 'input' | 'output', rect: {
    x?: string,
    y?: string,
    width?: string,
    height?: string
  }) => {
    const layerSelected = layer[selector];
    if (!layerSelected) return;

    const prevRect = { ...layerSelected.rect };

    for (const key of Object.keys(rect)) {
      const value = rect[key as keyof Rect];
      if (!value) continue;
      const valueAsInt = parseInt(value);
      if (isNaN(valueAsInt)) continue;
      prevRect[key as keyof Rect] = valueAsInt;
    }

    updateLayer(layer.id, {
      [selector]: {
        ...layerSelected,
        rect: prevRect, 
      }
    });
  }, [updateLayer, layer]);

  if (!layer.input) return;

  return (
    <>
    <section>
      <h2>Input Placement</h2>
      <S.Container>
        <S.PropertyRow>
          <span>X</span>
          <Input
            size='sm'
            value={layer.input.rect.x}
            type='number'
            onChange={(e) => {
              onChange('input', { x: e.target.value });
            }}
          />
          <span>Y</span>
          <Input
            size='sm'
            value={layer.input.rect.y}
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
            value={layer.input.rect.width}
            type='number'
            onChange={(e) => {
              onChange('input', { width: e.target.value });
            }}
          />
          <span>H</span>
          <Input
            size='sm'
            value={layer.input.rect.height}
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
            value={layer.output.rect.x}
            type='number'
            onChange={(e) => {
              onChange('output', { x: e.target.value });
            }}
          />
          <span>Y</span>
          <Input
            size='sm'
            value={layer.output.rect.y}
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
            value={layer.output.rect.width}
            type='number'
            onChange={(e) => {
              onChange('output', { width: e.target.value });
            }}
          />
          <span>H</span>
          <Input
            size='sm'
            value={layer.output.rect.height}
            type='number'
            onChange={(e) => {
              onChange('output', { height: e.target.value });
            }}
          />
        </S.PropertyRow>
      </S.Container>   
    </section>
  </>
  )
}