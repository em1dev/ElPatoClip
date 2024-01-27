import styled from "styled-components";

export const Container = styled.div`
  margin: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;

  > canvas:first-child {
    width: 960px;
    height: 540px;
  }

  > canvas:nth-child(2) {
    height: 960px;
    width: 540px;
  }
`;