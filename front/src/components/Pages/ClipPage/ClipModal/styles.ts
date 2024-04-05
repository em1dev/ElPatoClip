import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  background-color: #151515;
  display: flex;
  gap: 1em;
  flex-direction: column;
  padding: 1.5em;
  border-radius: 1.3em;
  iframe {
    background-color: #151515;
    aspect-ratio: 1920 / 1080;
    border: none;
    border-radius: 1em;
    max-width: 100%;
    height: 100%;
  }
`;

export const Button = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  margin: 0.5em;
  font-family: inherit;
  font-weight: 500;
  border: none;
  background: #FFEB39;
  color: #1A1A1A;
  border-radius: 5px;
  padding: 0.2em 0.7em;
`;