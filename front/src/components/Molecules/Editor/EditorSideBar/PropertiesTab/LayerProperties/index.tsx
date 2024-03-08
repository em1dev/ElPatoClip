import styled from "styled-components";
import { LayerFilter, LayerShape } from "../../../../../../types";
import { Select } from "../../../../../Atoms/Select";
import { PropertyTabInterface } from "../type";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  select {
    width: calc(30% + 2ch + 0.5em);
  }
`;

export interface LayerPropertiesProps extends PropertyTabInterface {}

export const LayerProperties = ({ layer, updateLayer }: LayerPropertiesProps) => {

  return (
    <Container>
      <div>
        <h2>Filter</h2>
        <div>
          <Select value={layer.filter} onChange={(e) => { 
            updateLayer(layer.id, { filter: e.target.value as LayerFilter })
          }}>
            <option value='blur'>Blur</option>
            <option value='none'>Normal</option>
          </Select>
        </div>
      </div>

      <div>
        <h2>Shape</h2>
        <div>
          <Select value={layer.shape} onChange={(e) => {
            updateLayer(layer.id, { shape: e.target.value as LayerShape })
          }}>
            <option value='rectangle'>Rectangle</option>
            <option value='round-rectangle'>Round Rectangle</option>
            <option value='circle'>Circle</option>
          </Select>
        </div>
      </div>
    </Container>
  );
}