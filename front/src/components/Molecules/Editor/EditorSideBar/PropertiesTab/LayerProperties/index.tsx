import * as S from './styles';
import { LayerFilter, LayerShape } from '../../../../../../types';
import { Select } from '../../../../../Atoms/Select';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';

export const LayerProperties = () => {
  const selectedLayer = useEditorState(state => state.selectedLayer);
  const updateLayerPartially = useEditorState(state => state.updateLayerPartially);

  if (!selectedLayer) return null;

  const isLocked = selectedLayer.locked;

  return (
    <S.Container>
      <div>
        <h2>Filter</h2>
        <Select disabled={isLocked} value={selectedLayer.filter} onChange={(e) => { 
          updateLayerPartially(selectedLayer.id, { filter: e.target.value as LayerFilter });
        }}>
          <option value='blur'>Blur</option>
          <option value='none'>Normal</option>
        </Select>
      </div>

      <div>
        <h2>Shape</h2>
        <Select disabled={isLocked} value={selectedLayer.shape} onChange={(e) => {
          updateLayerPartially(selectedLayer.id, { shape: e.target.value as LayerShape });
        }}>
          <option value='rectangle'>Rectangle</option>
          <option value='round-rectangle'>Round Rectangle</option>
          <option value='circle'>Circle</option>
        </Select>
      </div>
    </S.Container>
  );
};