import * as S from'./styles';
import { ChangeEvent, useCallback } from "react"
import { AspectRatio, Layer, LayerFilter } from "../../../../../types"
import { Select } from '../../../../Atoms/Select';
import { ButtonIcon } from '../../../../Atoms/ButtonIcon';

export interface LayerConfigurationProps {
  layer: Layer,
  onChange: (layer: Layer) => void,
  onOrderIncrease?: () => void,
  onOrderDecrease?: () => void,
  onDelete: () => void,
}

export const LayerConfiguration = ({
  layer,
  onChange,
  onOrderDecrease,
  onOrderIncrease,
  onDelete
}: LayerConfigurationProps) => {

  const onColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...layer,
      borderColor: e.target.value
    })
  }, [onChange, layer]);

  const onLockedChange = useCallback(() => {
    onChange({
      ...layer,
      locked: !layer.locked
    })
  }, [onChange, layer]);

  const onFilterChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value as LayerFilter;
    onChange({
      ...layer,
      filter
    });
  }, [onChange, layer]);

  const onAspectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const aspect = e.target.value as AspectRatio;
    onChange({
      ...layer,
      aspect
    });
  }, [onChange, layer]);

  return (
    <S.Container>
      <S.CloseButton>
        <ButtonIcon onClick={onDelete} alt='delete' iconName='MingcuteCloseFill.svg' />
      </S.CloseButton>

      <S.LeftContainer>
        <ButtonIcon
          disabled={!onOrderIncrease}
          onClick={onOrderIncrease}
          alt="up"
          iconName='MingcuteUpFill.svg'
        />
        <S.InputColor 
          value={layer.borderColor}
          onChange={onColorChange}
          type='color'
          />
        <ButtonIcon
          disabled={!onOrderDecrease}
          onClick={onOrderDecrease}
          alt="down"
          iconName='MingcuteDownFill.svg'
        />
      </S.LeftContainer>

      <S.OptionsContainer>
        <label>Aspect Ratio</label>
        <Select onChange={onAspectChange}>
          <option value='free'>Free</option>
          <option value='potrait'>Potrait</option>
          <option value='landscape'>Landscape</option>
          <option value='locked'>Locked</option>
        </Select>

        <label>Filter</label>
        <Select value={layer.filter} onChange={onFilterChange}>
          <option value='blur'>Blur</option>
          <option value='none'>Normal</option>
        </Select>
      </S.OptionsContainer>

      <div>
        <ButtonIcon alt="locked" 
          selected={layer.locked}
          onClick={onLockedChange}
          iconName={
            layer.locked ?
            'MingcuteLockLine.svg' :
            'MingcuteUnlockLine.svg'
          } />
      </div>

    </S.Container>
  )
}