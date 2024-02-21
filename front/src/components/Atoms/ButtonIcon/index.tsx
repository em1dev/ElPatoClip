import { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  iconName: string,
  alt: string,
  disabled?: boolean,
  selected?: boolean,
}

export const ButtonIcon = ({ iconName, alt, disabled, selected, ...props }: ButtonIconProps) => (
  <ButtonContainer selected={selected} disabled={disabled} {...props}>
    <img width={25} height={25} alt={alt} src={`/icons/${iconName}`}></img>
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
    background-color: #CDCDCD;
    &:not(:disabled):hover {
      background-color: #e0e0e0;
    }
  `}
`;