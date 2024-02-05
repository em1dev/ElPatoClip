import * as S from './styles';

export interface MainTemplateProps {
  children: React.ReactNode;
}

const MainTemplate = (props: MainTemplateProps) => (
  <>
    <S.Header> El Pato Clip </S.Header>
    <S.Container>
      {props.children}
    </S.Container>
  </>
);

export default MainTemplate;