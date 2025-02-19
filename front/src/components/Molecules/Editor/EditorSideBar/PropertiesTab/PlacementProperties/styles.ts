import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 0.5em;
`;


export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  > * {
    flex: 1;
  }
`;

export const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
  > input {
    width: 30%;
  }
  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 2ch;
    max-width: 2ch;
    min-width: 2ch;
  }
`;