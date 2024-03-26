import * as S from './styles';

import { useState } from 'react';
import { Layer } from '../../../../types';
import { LayerTab } from './LayerTab';
import { PropertiesTab } from './PropertiesTab';

export interface EditorSideBarProps {
  layers: Array<Layer>
  setLayers: React.Dispatch<React.SetStateAction<Array<Layer>>>,
  selectedLayerId: number | null,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<number | null>>,
}

enum Tabs {
  Layer,
  Properties
}

export const EditorSideBar = ({
  layers,
  setLayers,
  selectedLayerId,
  setSelectedLayerId
}: EditorSideBarProps) => {
  const [selectedTab, setSelectedTab] = useState(Tabs.Layer);

  return (
    <S.Container>
      <S.TabButtonContainer>
        <S.TabButton $selected={selectedTab === Tabs.Layer} onClick={() => setSelectedTab(Tabs.Layer)}>
          Layers
        </S.TabButton>
        <S.TabButton $selected={selectedTab === Tabs.Properties} onClick={() => setSelectedTab(Tabs.Properties)}>
          Properties
        </S.TabButton>
      </S.TabButtonContainer>

      { selectedTab === Tabs.Layer && (
        <S.TabContent>
          <LayerTab 
            onLayersChange={setLayers} 
            layers={layers} 
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
          />
        </S.TabContent>
      )}

      { selectedTab === Tabs.Properties && (
        <S.TabContent>
          <PropertiesTab 
            onLayersChange={setLayers} 
            layers={layers} 
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
          />
        </S.TabContent>
      )}

    </S.Container>
  );
};