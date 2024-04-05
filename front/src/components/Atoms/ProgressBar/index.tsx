import * as S from './styles';

export interface ProgressBarProps {
  total: number,
  progress: number
}

export const ProgressBar = ({
  total, progress
}: ProgressBarProps) => (
  <S.ProgressBar $progress={(progress / total) * 100} />
);
