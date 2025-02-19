import * as S from './styles';

import { useCallback, useState } from 'react';
import { LayerTab } from './LayerTab';
import { PropertiesTab } from './PropertiesTab';
import { useEditorState } from '../../../../store/EditorState/useEditorState';
import { addNewLayer } from '../../../../Utils/LayerGenerator';

export interface SideBarSectionProps {
  defaultIsVisible?: boolean,
  title: React.ReactNode,
  children: React.ReactNode,
  onAddBtnClick?: () => void,
}

export const SideBarSection = (props: SideBarSectionProps) => {
  const [isVisible, setIsVisible] = useState(props.defaultIsVisible);

  return (
    <S.Section>
      <S.SectionHeader>
        <S.SectionCollapseBtn 
          onClick={() => setIsVisible(!isVisible)}
          type="button">
          <img 
            width={20} 
            alt="" 
            src={`/icons/${ isVisible ? 'MingcuteDownFill' : 'MingcuteUpFill'}.svg`} />
          {props.title}
        </S.SectionCollapseBtn>
        {props.onAddBtnClick && (
          <S.SectionAddBtn title="New Layer" type="button" onClick={props.onAddBtnClick}>
            <img 
              width={20} 
              alt="" 
              src="/icons/MingcuteAddFill.svg" />
          </S.SectionAddBtn>
        )}
      </S.SectionHeader>
      {isVisible && (
        <div>
          {props.children}
        </div>
      )}
    </S.Section>
  );
};

export const EditorSideBar = () => {
  const selectedLayer = useEditorState(state => state.selectedLayer);
  const setLayers = useEditorState(state => state.setLayers);
  const setSelectedLayer = useEditorState(state => state.setSelectedLayer);
  const layers = useEditorState(state => state.layers);

  const updateLayers = useCallback(() => {
    const modifiedLayers = addNewLayer(layers);
    setLayers(modifiedLayers);
    setSelectedLayer(modifiedLayers.at(-1)?.id || null);
  }, [setLayers, layers, setSelectedLayer]);

  return (
    <S.Container>
      <SideBarSection title="Layers" defaultIsVisible onAddBtnClick={updateLayers}>
        <LayerTab />
      </SideBarSection>

      {selectedLayer && (
        <SideBarSection title="Properties" defaultIsVisible>
          <PropertiesTab />
        </SideBarSection>
      )}

    </S.Container>
  );
};