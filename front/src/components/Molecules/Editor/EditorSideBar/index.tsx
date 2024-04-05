import * as S from './styles';

import { useState } from 'react';
import { LayerTab } from './LayerTab';
import { PropertiesTab } from './PropertiesTab';

enum Tabs {
  Layer,
  Properties
}

export const EditorSideBar = () => {
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
          <LayerTab />
        </S.TabContent>
      )}

      { selectedTab === Tabs.Properties && (
        <S.TabContent>
          <PropertiesTab />
        </S.TabContent>
      )}

    </S.Container>
  );
};