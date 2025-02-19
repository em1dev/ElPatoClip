import * as S from './styles';
import { InputHTMLAttributes, useId } from 'react';


export interface PropertyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
}

export const PropertyInput = (props: PropertyInputProps) => {
  const id = useId();

  return (
    <S.InputContainer>
      <label htmlFor={id}>{props.label}</label>
      <input {...props} id={id} />
    </S.InputContainer>
  );
};