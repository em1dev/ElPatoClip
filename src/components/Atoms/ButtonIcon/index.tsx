import { HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  iconName: string,
  alt: string
}

export const ButtonIcon = ({ iconName, alt, ...props }: ButtonIconProps) => (
  <ButtonContainer {...props}>
    <img width={20} height={20} alt={alt} src={`/icons/${iconName}`}></img>
  </ButtonContainer>
);

const ButtonContainer = styled.button`
  color: #E3E3E3;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  border-radius: 0.2em;
  margin: 0;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: #2f2f2f;
  }
`;