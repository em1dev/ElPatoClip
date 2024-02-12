import { styled } from "styled-components";

export const Page = styled.div`
  max-width: 90em;
  margin: auto;
  padding: 2em;
`;

export const Header = styled.div`
  padding: 0.5em 1.5em;
`;

export const Container = styled.div`
  display: grid;
  gap: 3em;
  padding: 0.5em;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

export const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1em;
  justify-content: center;
  align-items: center;
`;

export const ProfileDetails = styled.div`
  padding: 1em 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
  font-size: 1.1em;

  img {
    width: 5ch;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    padding: 4px;
    border: solid 2px #D9D9D9;
  }
`;

export const FilterContainer = styled.div`
  padding: 0.5em 0;
  display: flex;
  gap: 0.5em;
  align-items: center;
`;