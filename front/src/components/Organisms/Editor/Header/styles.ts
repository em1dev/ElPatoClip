import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > a {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      text-underline-offset: 0.4em;
      text-decoration: underline;
    }
  }
`;

export const CanvasSelectionContainer = styled.div`
  display: flex;
`;

export const CanvasSelectionButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected }) => selected ? '#313131' : 'transparent'};
  &:hover {
    background-color: #272727;
  }
  cursor: pointer;
  border: none;
  img {
    height: 60px;
  }
`;