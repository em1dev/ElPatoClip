import styled from 'styled-components';

export const Container = styled.div`
  background-color: #151515;
  border-radius: 17px;
  padding: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  input {
    width: 20ch;
    padding: 0.5em 0.8em;
  }

  > div {
    display: flex;
    align-items: center;
    gap: 1em;
  }
`;