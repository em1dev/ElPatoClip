import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer } from '../../../../../../types';
import * as S from '../styles';
import { ButtonIcon } from '../../../../../Atoms/ButtonIcon';

export interface LayerItemProps {
  layer: Layer,

  selectedLayerId: number | null,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<number | null>>,

  dragLayerId: number | null,
  setDragLayerId: React.Dispatch<React.SetStateAction<number | null>>,

  updateLayer: (id: number, changes: Partial<Layer>) => void,
  updateLayers:  React.Dispatch<React.SetStateAction<Array<Layer>>>,
}

export const LayerItem = ({
    dragLayerId,
    layer,
    selectedLayerId,
    setDragLayerId,
    setSelectedLayerId,
    updateLayer,
    updateLayers
  }: LayerItemProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  useEffect(() => {
    if (selectedLayerId !== layer.id) {
      setIsEditingName(false);
    }
  }, [selectedLayerId, isEditingName, layer]);

  useEffect(() => {
    if (!isEditingName) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
  }, [isEditingName]);

  const onLayerClick = useCallback(() => {
    setSelectedLayerId(layer.id);
  }, [layer, setSelectedLayerId])

  const onDragEnd:React.DragEventHandler<HTMLDivElement> = useCallback(() => {
    setDragLayerId(null);
  }, [setDragLayerId])

  const onDragOver:React.DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.id === undefined) return;
    e.preventDefault();
    const box = target.getBoundingClientRect();
    const centerY = box.y + (box.height / 2);
    target.dataset.over = e.clientY < centerY ? 'top' : 'bot';
  }

  const onDragEnter:React.DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.id === undefined) return;
    e.preventDefault();
  }

  const onDragLeave:React.DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.id === undefined) return;
    e.preventDefault();
    target.dataset.over = undefined;
  }

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    if (id === undefined) return;
    const isOnTop = target.dataset.over === 'top';
    target.dataset.over = undefined;
    if (id === dragLayerId?.toString()) return;
    updateLayers((prev) => {
      const layersSortedAsc = prev
        .filter(l => l.id !== dragLayerId)
        .sort((a,b) => a.zIndex - b.zIndex);

      const draggedLayer = prev.find(l => l.id === dragLayerId);
      const hoveredLayer = prev.find(l => l.id.toString() === id);
      if (!draggedLayer || !hoveredLayer) return prev;

      let dragIndex = layersSortedAsc.findIndex(l => l.id.toString() === id);
      if (dragIndex === -1) return prev;
      if (isOnTop) {
        dragIndex += 1;
      }
      const rest = layersSortedAsc.splice(dragIndex);
      const newArray = [...layersSortedAsc,  draggedLayer, ...rest]
        .map((l, index) => ({...l, zIndex: index}));
      return newArray;
    });
  };

  const onLockedButtonClicked = (
    e:React.MouseEvent<HTMLButtonElement, MouseEvent>, layer: Layer
    ) => {
    e.stopPropagation();
    updateLayer(layer.id, { locked: !layer.locked });
    setSelectedLayerId(layer.id);
  };

  const onDoubleClick = () => {
    setIsEditingName(true);
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!isEditingName) return;
    if (['Escape', 'Enter'].includes(e.key)) {
      setIsEditingName(false);
    }
  }

  return (
    <S.LayerButtonContainer 
      $selected={selectedLayerId === layer.id}
      key={layer.id}         
      data-id={layer.id}
      draggable
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDragStart={() => {
        setDragLayerId(layer.id)
        setSelectedLayerId(layer.id)
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <S.LayerButton 
        hidden
        onDoubleClick={onDoubleClick}
        onClick={onLayerClick} 
      />
      <div>
        <S.InputColor 
          onClick={() => setSelectedLayerId(layer.id)}
          onChange={(e) => updateLayer(layer.id, { borderColor: e.target.value })} 
          type='color' 
          value={layer.borderColor} 
        />
        {isEditingName ? 
          <S.InputText
            onKeyDown={onKeyDown}
            ref={inputRef}
            value={layer.name}
            onChange={(e) => { updateLayer(layer.id, { name: e.target.value })}}
          />
        : (
          <span> {layer.name} </span>
        )
        }
      </div>

      <div>
        <ButtonIcon alt="locked" 
          selected={layer.locked}
          onClick={(e) => onLockedButtonClicked(e, layer)}
          iconName={
            layer.locked ?
            'MingcuteLockLine.svg' :
            'MingcuteUnlockLine.svg'
          } 
        />
      </div>
    </S.LayerButtonContainer>
  )
};