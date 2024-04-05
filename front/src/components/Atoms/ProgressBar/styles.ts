import styled from 'styled-components';

export const ProgressBar = styled.div<{
  $progress: number
}>`
  width: 100%;
  height: 0.5em;
  background-color: #222222;
  border-radius: 16px;
  position: relative;
  overflow: hidden;


  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 16px;

    background-color: #EAED5D;
    transition: width 0.5s ease-in-out;
    width: ${props => `${props.$progress}%`};
    height: 0.5em;
  }
`;