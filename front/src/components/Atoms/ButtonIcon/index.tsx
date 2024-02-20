import { HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  iconName: string,
  alt: string,
  disabled?: boolean
}

export const ButtonIcon = ({ iconName, alt, disabled, ...props }: ButtonIconProps) => (
  <ButtonContainer disabled={disabled} {...props}>
    <img width={25} height={25} alt={alt} src={`/icons/${iconName}`}></img>
  </ButtonContainer>
);

const ButtonContainer = styled.button`
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
`;