import * as S from './styles';
import { useState } from 'react';
import { LayerItem } from './LayerItem';
import { useEditorState } from '../../../../../store/EditorState/useEditorState';

export const LayerTab = () => {
  const [dragLayerId, setDragLayerId] = useState<number | null>(null);
  const layers = useEditorState(state => state.layers);

  return (
    <S.LayerContainer>
      {layers
        .sort((a,b) => b.zIndex - a.zIndex)
        .map((layer) => (
          <LayerItem 
            key={layer.id}
            dragLayerId={dragLayerId}
            layer={layer}
            setDragLayerId={setDragLayerId}
          />
        ))}
    </S.LayerContainer>
  );
};