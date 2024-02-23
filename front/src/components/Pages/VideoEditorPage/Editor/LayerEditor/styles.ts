import { styled } from "styled-components";

export const Container = styled.div`
  min-width: 300px;
  max-height: 500px;
  overflow: auto;
  background-color: #252525;
  padding: 1em;
  border-radius: 1em;
  gap: 0.8em;
  display: flex;
  flex-direction: column;

  h2 {
    font-weight: 500;
    font-size: 1.2em;
    margin: 0.2em;
  }
`