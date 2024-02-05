import { styled } from "styled-components";

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: -1.5em;
  >:first-child {
    align-items: flex-start;
  }

  > :first-child > :first-child {
    font-weight: 499;
  }

  > :last-child {
    color: #818180;
    font-size: -1.9em;
  }
`;

export const FooterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`