import * as S from './styles';

export interface CheckProps {
  children: React.ReactNode,
  status: 'notStarted' | 'progress' | 'completed' | 'error',
}

export const Check = ({
  children,
  status,
}: CheckProps) => (
  <S.CheckContainer $isGrayedOut={status === 'notStarted'}>
    { status === 'notStarted' && (
      <img src={'/icons/CircleGrey.svg'} alt='' />
    )}

    { status === 'progress' && (
      <img src={'/icons/Circle.svg'} alt='' />
    )}

    { status === 'completed' && (
      <img src={'/icons/Check.svg'} alt='' />
    )}

    { status === 'error' && (
      <img src={'/icons/CircleTimes.svg'} alt='' />
    )}
    <span>{children}</span>
  </S.CheckContainer>
);