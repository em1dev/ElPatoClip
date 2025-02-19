import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer } from '../../../../../../types';
import * as S from '../styles';
import { ButtonIcon } from '../../../../../Atoms/ButtonIcon';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';

export interface LayerItemProps {
  layer: Layer,
  dragLayerId: number | null,
  setDragLayerId: React.Dispatch<React.SetStateAction<number | null>>,
}

export const LayerItem = ({
  dragLayerId,
  layer,
  setDragLayerId,
}: LayerItemProps) => {
  const layers = useEditorState(state => state.layers);
  const setLayers = useEditorState(state => state.setLayers);
  const updateLayerPartially = useEditorState(state => state.updateLayerPartially);
  const selectedLayer = useEditorState(state => state.selectedLayer);
  const setSelectedLayer = useEditorState(state => state.setSelectedLayer);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  useEffect(() => {
    if (selectedLayer?.id !== layer.id) {
      setIsEditingName(false);
    }
  }, [selectedLayer, isEditingName, layer]);

  useEffect(() => {
    if (!isEditingName) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
  }, [isEditingName]);

  const onLayerClick = useCallback(() => {
    setSelectedLayer(layer.id);
  }, [layer, setSelectedLayer]);

  const onDragEnd:React.DragEventHandler<HTMLDivElement> = useCallback(() => {
    setDragLayerId(null);
  }, [setDragLayerId]);

  const onDragOver:React.DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.id === undefined) return;
    e.preventDefault();
    const box = target.getBoundingClientRect();
    const centerY = box.y + (box.height / 2);
    target.dataset.over = e.clientY < centerY ? 'top' : 'bot';
  };

  const onDragEnter:React.DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.id === undefined) return;
    e.preventDefault();
  };

  const onDragLeave:React.DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.id === undefined) return;
    e.preventDefault();
    target.dataset.over = undefined;
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    if (id === undefined) return;
    const isOnTop = target.dataset.over === 'top';
    target.dataset.over = undefined;
    if (id === dragLayerId?.toString()) return;

    const layersSortedAsc = layers
      .filter(l => l.id !== dragLayerId)
      .sort((a,b) => a.zIndex - b.zIndex);

    const draggedLayer = layers.find(l => l.id === dragLayerId);
    const hoveredLayer = layers.find(l => l.id.toString() === id);
    if (!draggedLayer || !hoveredLayer) return;

    let dragIndex = layersSortedAsc.findIndex(l => l.id.toString() === id);
    if (dragIndex === -1) return;
    if (isOnTop) {
      dragIndex += 1;
    }
    const rest = layersSortedAsc.splice(dragIndex);
    const newLayers = [...layersSortedAsc,  draggedLayer, ...rest]
      .map((l, index) => ({...l, zIndex: index}));
    setLayers(newLayers);
  }, [layers, dragLayerId, setLayers]);

  const onLockedButtonClicked = (
    e:React.MouseEvent<HTMLButtonElement, MouseEvent>, layer: Layer
  ) => {
    e.stopPropagation();
    updateLayerPartially(layer.id, { locked: !layer.locked });
    setSelectedLayer(layer.id);
  };

  const onDoubleClick = () => {
    setIsEditingName(true);
  };

  const onDeleteButtonClicked = (
    e:React.MouseEvent<HTMLButtonElement, MouseEvent>, layer: Layer
  ) => {
    e.stopPropagation();
    setLayers(layers.filter(l => l.id !== layer.id));
    setSelectedLayer(null);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!isEditingName) return;
    if (['Escape', 'Enter'].includes(e.key)) {
      setIsEditingName(false);
    }
  };

  return (
    <S.LayerButtonContainer 
      $selected={selectedLayer?.id === layer.id}
      key={layer.id}
      data-id={layer.id}
      draggable
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDragStart={() => {
        setDragLayerId(layer.id);
        setSelectedLayer(layer.id);
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <S.LayerButton 
        hidden
        onClick={onLayerClick} 
      />
      <div>
        <img 
          draggable={false} 
          alt="" 
          width={25} 
          src="/icons/MingcuteDotsLine.svg"
        />
        <S.InputColor 
          onClick={() => setSelectedLayer(layer.id)}
          onChange={(e) => updateLayerPartially(layer.id, { borderColor: e.target.value })} 
          type='color' 
          value={layer.borderColor} 
        />
      </div>

      {isEditingName ? 
        <S.InputText
          onKeyDown={onKeyDown}
          ref={inputRef}
          value={layer.name}
          onChange={(e) => { updateLayerPartially(layer.id, { name: e.target.value });}}
        />
        : (
          <S.LayerName
            onClick={onLayerClick} 
            onDoubleClick={onDoubleClick}
          > {layer.name} </S.LayerName>
        )
      }

      <div>
        <ButtonIcon 
          draggable={false}
          title={layer.locked ? 'lock' : 'unlock'}
          size='sm'
          selected={layer.locked}
          onClick={(e) => onLockedButtonClicked(e, layer)}
          iconName={
            layer.locked ?
              'MingcuteLockLine.svg' :
              'MingcuteUnlockLine.svg'
          } 
        />
        <ButtonIcon 
          disabled={layer.locked}
          draggable={false}
          title="delete"
          size='sm'
          onClick={(e) => onDeleteButtonClicked(e, layer)}
          iconName={'MingcuteCloseFill.svg'}
        />
      </div>
    </S.LayerButtonContainer>
  );
};