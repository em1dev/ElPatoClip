import styled from 'styled-components';


export const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

export const Card = styled.div`
  background-color: #151515;
  border-radius: 17px;
  padding: 2em;

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1.5em;

  p {
    margin: 0;
  }
`;

export const Container = styled.form`
  background-color: #151515;
  border-radius: 17px;
  padding: 2em;

  display: flex;
  flex-direction: column;
  gap: 1.5em;

  h3 {
    margin: 0;
  }

  p {
    margin: 0;
  }
  font-weight: 300;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  > label, h4 {
    margin: 0;
    font-weight: 500;
    font-size: 1.1em;
  }
`;

export const Label = styled.label<{ $disabled: boolean }>`
  color: ${({ $disabled }) => $disabled ? 'grey' : 'inherit'};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : ''};
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const Checkbox = styled.input`
  margin: 0.8em;
  transform: scale(1.5);

  &:disabled {
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  justify-content: flex-end;
  display: flex;
  gap: 0.5em;
`;

export const ErrorText = styled.span`
  color: #FF9179;
`;

export const WarningText = styled.span`
  color: #FFF279;
`;

export const AgreementText = styled.p`
  color: white;
  a {
    color: #FFF279;
    text-decoration: underline;
    text-underline-offset: 0.4em;

    &:hover {
      color: #d8cd64;
    }
  }
`;