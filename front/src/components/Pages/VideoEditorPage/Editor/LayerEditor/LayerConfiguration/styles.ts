import { styled } from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1em;
  padding-bottom: 1.4em;
  background-color: #1A1A1A;
  border-radius: 0.5em;
  gap: 0.5em;
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  img {
    width: 15px;
    height: 15px;
  }
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
`;

export const OptionsContainer = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

export const InputColor = styled.input`
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