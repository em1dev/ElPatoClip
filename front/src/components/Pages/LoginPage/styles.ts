import styled from 'styled-components';

export const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: auto;
  margin-top: 10em;
  max-width: 400px;

  h1 {
    text-align: center;
    font-size: 2em;
    font-weight: 500;
  }
`;

export const LoginLink = styled.a`
  border-radius: 4px;
  width: 100%;
  height: 65px;
  background-color: #282828;
  border: solid 1px #3C3C3C;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8em;

  &:hover {
    border: solid 2px #858585;
  }
`;