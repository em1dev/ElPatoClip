import * as S from './styles';
import { LayerProperties } from './LayerProperties';
import { PlacementProperties } from './PlacementProperties';

export const PropertiesTab = () => (
  <S.Container>
    <PlacementProperties />
    <LayerProperties />
  </S.Container>
);