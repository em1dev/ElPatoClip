import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3em;
  padding: 0.5em;
`

export const ModalOverlay = styled.div`
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  > div {
    max-width: 80%;
    max-height: 80%;
  }
`;