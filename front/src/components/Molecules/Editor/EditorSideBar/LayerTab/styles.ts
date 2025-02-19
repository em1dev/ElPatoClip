import styled, { css } from 'styled-components';


export const LayerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LayerButton = styled.button`
  cursor: pointer;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
`;

export const LayerButtonContainer = styled.div<{ $selected?: boolean }>`
  cursor: pointer;
  z-index: 1;
  position: relative;
  border: none;
  background-color: transparent;
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    display: flex;
    align-items: center;
  }
  > *:nth-child(2) {
    gap: 0.5em;
  }
  > :last-child {
    z-index: 2;
  }
  ${({ $selected }) => $selected && css`
    background-color: #262626;
  `}
  &:hover {
    outline: solid 1px #CDCDCD;
  }
  &[data-over='top'] {
    box-shadow: 0px 3px 0 0px inset #CDCDCD;
  }
  &[data-over='bot'] {
    box-shadow: 0px -3px 0 0px inset #CDCDCD;
  }
`;

export const InputColor = styled.input`
  z-index: 2;
  &,
  &::-webkit-color-swatch-wrapper,
  &::-webkit-color-swatch {
    width: 1.5em;
    height: 1.5em;
    border-radius: 100%;
    box-sizing: border-box;
    padding: 0;
    border: 0;
  }

  outline: none;
  border: 0;
  cursor: pointer;
`;

export const InputText = styled.input`
  max-width: 8em;
  font-size: inherit;
  font-family: inherit;
  border: none;
  border-radius: 0.3em;
  margin-left: -0.5em;
  padding: 0.3em 0.5em;
`;

export const LayerName = styled.span`
  flex: 1;
  overflow: hidden;
  max-width: 8em;
  text-overflow: ellipsis;
  white-space: nowrap;

  // bigger double click area
  margin-top: -0.5em;
  margin-bottom: -0.5em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;
`;