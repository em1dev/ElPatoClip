import { keyframes, styled } from "styled-components";

export const Loading = () => (
  <LoadingContainer>
    <img src='/icons/loading.png' />
  </LoadingContainer>
);

const Spin = keyframes`
  0% {
    transform: rotate(0deg) scale(1) translate(0,0);
  }
  25% {
    transform: rotate(180deg) scale(1.2) translate(20px, 0);
  }
  75% {
    transform: rotate(-180deg) scale(1) translate(-20px, 0);
  }
  100% {
    transform: rotate(0deg) scale(1) translate(0,0);
  }
`;

const LoadingContainer = styled.div`
  img {
    width: 3em;
    animation: ${Spin} 2s ease-in-out infinite;
  }
`;