import * as S from './styles';

export interface ClipFooterMetadata {
  title?: React.ReactNode,
  rightTitle?: React.ReactNode,
  subTitle?: React.ReactNode,
  subTitleRight?: React.ReactNode
}

const ClipFooterMetadata = ({
  title,
  rightTitle,
  subTitle,
  subTitleRight
}: ClipFooterMetadata) => (
  <S.Footer>
    <S.FooterItem>
      <div>{title}</div>
      <div>{rightTitle}</div>
    </S.FooterItem>
    <S.FooterItem>
      <div>{subTitle}</div>
      <div>{subTitleRight}</div>
    </S.FooterItem>
  </S.Footer>
)

export default ClipFooterMetadata;