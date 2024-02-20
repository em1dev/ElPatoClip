import * as S from'./styles';
import { ChangeEvent, useCallback } from "react"
import { Layer } from "../../../../../types"
import { Select } from '../../../../Atoms/Select';
import { ButtonIcon } from '../../../../Atoms/ButtonIcon';

export interface LayerConfigurationProps {
  layer: Layer,
  onChange: (layer: Layer) => void,
  onOrderIncrease?: () => void,
  onOrderDecrease?: () => void,
}

export const LayerConfiguration = ({
  layer,
  onChange,
  onOrderDecrease,
  onOrderIncrease
}: LayerConfigurationProps) => {

  const onColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...layer,
      borderColor: e.target.value
    })
  }, [onChange, layer]);

  return (
    <S.Container>
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
        <Select>
          <option>Locked</option>
          <option>Free</option>
        </Select>

        <label>Filter</label>
        <Select>
          <option>Blur</option>
          <option>Normal</option>
        </Select>
      </S.OptionsContainer>

      <div>
        <ButtonIcon alt="locked" iconName='MingcuteUnlockLine.svg' />
      </div>

    </S.Container>
  )
}