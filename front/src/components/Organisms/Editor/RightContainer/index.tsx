import * as S from './styles';
import { Dispatch, SetStateAction } from 'react';
import { Layer } from '../../../../types';
import { EditorSideBar } from '../../../Molecules/Editor/EditorSideBar';

export interface RightContainerProps {
  layers: Array<Layer>,
  setLayers: Dispatch<SetStateAction<Array<Layer>>>,
  selectedLayerId: number | null,
  setSelectedLayerId: Dispatch<SetStateAction<number | null>>,
}

export const RightContainer = ({
  layers,
  selectedLayerId,
  setLayers,
  setSelectedLayerId
}: RightContainerProps) => (
  <S.Container>
    <EditorSideBar 
      layers={layers}
      selectedLayerId={selectedLayerId}
      setLayers={setLayers}
      setSelectedLayerId={setSelectedLayerId}
    />
  </S.Container>
);