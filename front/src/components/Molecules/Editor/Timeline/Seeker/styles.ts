import { css, styled } from 'styled-components';

export const Seeker = styled.div<{ 
    $animate?: boolean,
    $replaceHeadLeftOffset?: number
  }>`

  ${({ $animate }) => $animate && css`
    transition: left 0.3s ease-in-out;
  `}

  bottom: 10px;
  left: 5em;
  position: absolute;
  cursor: pointer;
  border-radius: 3px;
  width: 3px;
  background-color: white;
  height: 80%;

  &:before {
    position: relative;
    font-weight: 500;
    background-color: white;
    display: block;
    transform: scale(1);
    transition: all 0.2s ease-in-out;
  }

  &[data-dragging='false']:before{
    left: -6px;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    content: '';
    color: rgba(0,0,0,0);
  }

  &[data-dragging='true']:before,
  &:hover:before {
    transform: scale(1.1);
    text-align: center;
    padding: 0.2em;
    left: 
    ${({ $replaceHeadLeftOffset }) => $replaceHeadLeftOffset !== undefined ? 
    `${$replaceHeadLeftOffset}px` :
    'calc(-80px / 2)'
};
    color: rgba(26,26,26,1);
    top: -1ch;
    width: 80px;
    border-radius: 10px;
    content: attr(data-time);
    height: auto;
  }
`;