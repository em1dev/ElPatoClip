import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const TabContent = styled.div`
  background-color: #1A1A1A;
  border-left: solid #494949 1px;
  height: 100%;
`;

export const TabButtonContainer = styled.div`
  background-color: #0B0B0B;
`;

export const TabButton = styled.button<{ $selected?: boolean }>`
  border: none;
  padding: 0.5em 1em;

  &:first-child {
    border-left: solid #494949 1px;
    border-radius: 0.2em 0 0 0;
  }
  &:last-child {
    border-radius: 0 0.2em 0 0;
  }

  ${({$selected}) => $selected ? 
    css`
      background-color: #1A1A1A;
      color: #D9D9D9;
    ` : 
    css`
      cursor: pointer;
      background-color: #0B0B0B;
      color: #808080;
      &:hover {
        color: #D9D9D9;
      }
    `
}
`;