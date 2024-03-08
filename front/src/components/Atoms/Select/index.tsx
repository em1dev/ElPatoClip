import styled from 'styled-components';

export const Select = styled.select`
  outline: none;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  padding: 0.5em;
  font-size: 1em;

  background-color: #272727;
  color: #d9d9d9;

  &:focus-within {
    outline: 2px solid #D9D9D9;
  }
`;