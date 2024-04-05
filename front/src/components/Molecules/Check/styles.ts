import { css, styled } from 'styled-components';

export const CheckContainer = styled.div<{ $isGrayedOut?: boolean }>`
  display: flex;
  gap: 1em;

  img {
    width: 1.5em;
  }

  ${ props => props.$isGrayedOut && css`
    color: #a5a5a5;
  `}
`;