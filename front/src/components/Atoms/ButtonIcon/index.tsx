import { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  iconName: string,
  title: string,
  disabled?: boolean,
  selected?: boolean,
  size?: 'sm' | 'md'
}

const sizeMap = {
  'sm': 20,
  'md': 25
};

export const ButtonIcon = ({ iconName, disabled, selected, size='md', ...props }: ButtonIconProps) => (
  <ButtonContainer selected={selected} disabled={disabled} {...props}>
    <img 
      width={sizeMap[size]} 
      height={sizeMap[size]} 
      alt=""
      src={`/icons/${iconName}`} 
      draggable={props.draggable} />
  </ButtonContainer>
);

const ButtonContainer = styled.button<{ selected?: boolean }>`
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  border-radius: 0.2em;
  margin: 0;
  background-color: transparent;

  &:not(:disabled) {
    color: #E3E3E3;
    cursor: pointer;
    &:hover {
      background-color: #2f2f2f;
    }
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  ${({selected}) => selected && css`
    background-color: #4e4e4e;
    &:not(:disabled):hover {
      background-color: #4f4f4f;
    }
  `}
`;