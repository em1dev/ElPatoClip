import styled from "styled-components";

export const Container = styled.button`
  &:focus-within {
    outline: solid 2px #d3d3d3;
  }

  font-family: inherit;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: initial;
  justify-content: initial;
  text-align: initial;
  gap: 0.8em;
  flex: 1 100%;
  padding: 1em;
  border-radius: 1em;
  cursor: pointer;
  transition: box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
  background-color: transparent;
  box-shadow: #00000052 0 0 0 0;
  &:hover {
    background-color: #272727;
    box-shadow: #00000052 0 0 20px 2px;
  }
`;

export const EmbedContainer = styled.div`
  cursor: pointer;
  transition: outline 0.1s ease-in-out;
  border: none;
  background-color: transparent;
  overflow: hidden;
  position: relative;
  border-radius: 16px;
  aspect-ratio: 1920 / 1080;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.8em;
  > :first-child {
    align-self: flex-start;
  }
  > :last-child {
    align-self: flex-end;
  }
  z-index: 1;
  img, iframe {
    width: 100%;
    height: 100%;
    border: none;
    opacity: 0.7;
    position: absolute;
    top: 0;
    left: 0;
  }
  > :not(img):not(iframe) {
    z-index: 2;
  }
`;

