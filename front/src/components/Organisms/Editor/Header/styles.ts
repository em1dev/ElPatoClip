import styled from "styled-components";

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