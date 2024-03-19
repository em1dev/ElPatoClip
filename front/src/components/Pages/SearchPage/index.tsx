import { useEffect, useMemo, useState } from 'react';
import * as S from './styles';
import { ChannelSearchResponse } from '../../../api/elPatoClipApi/types';
import { useDebouce } from '../../../hooks/useDebounce';
import { Loading } from '../../Atoms/Loading';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { recentChannelsStore } from '../../../store/recentChannelsStore';

const recentItems = recentChannelsStore.load();

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const searchString = useDebouce(value);
  const [searchResults, setSearchResult] = useState<Array<ChannelSearchResponse>>([]);

  useEffect(() => {
    (async () => {
      if (searchString.trim().length === 0) {
        setSearchResult([]);
        return;
      }
      setIsLoading(true);
      const resp = await ElPatoApi.searchUser(searchString);
      setSearchResult(resp);
      setIsLoading(false);
    })();
  }, [searchString])

  const SearchResults = useMemo(() => {
    if (!searchString.trim()) return null;

    if (isLoading) {
      return (<Loading />);
    }

    if (!searchResults.length) {
      return <div>Not found</div>
    }

    return (
      searchResults
      .sort((prev, next) => {
        const a = next.displayName.toLowerCase()
          .includes(searchString.toLowerCase());

        const b = prev.displayName.toLowerCase()
          .includes(searchString.toLowerCase())

        if (a === b) return 0;
        return (a) ? 1 : -1
      })
      .map((item) => (
        <S.SearchResultItem to={`/clips/${item.id}`} key={item.id}>
          <img alt={item.displayName} src={item.profileImg} />
          {item.displayName}
        </S.SearchResultItem>
    )));
  }, [searchString, searchResults, isLoading]);

  return (
    <S.Page>
      <S.SearchSection>
        <div>
          <h1>El Pato Clip</h1>
          <p>Edit your twitch clips into vertical format for TikTok and YouTube shorts</p>
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder='twitch channel name' />
          { SearchResults && (
              <S.SearchResultContainer>
                {SearchResults}
              </S.SearchResultContainer>
          ) }

          {!!recentItems.length && !SearchResults  && (
            <S.RecentItemsContainer>
              {
                recentItems.map((item) => (
                  <S.SearchResultItem to={`/clips/${item.id}`} key={item.id}>
                    <img alt={item.displayName} src={item.profileImg} />
                    {item.displayName}
                  </S.SearchResultItem>
                ))
              }
            </S.RecentItemsContainer>
          )}

          <p><i>100% Free, Open source and no watermark</i></p>
        </div>
        <img src="/imgs/EditorPreview.png"/>
      </S.SearchSection>

      <S.CenterSection>
        <h2>What is El Pato Clip</h2>
        <p>An open source project developed by streamers to meet streamers needs. 100% free and open source with no watermark</p>
        <p>Offers more functionality than the existing Twitch clip editor, while remaining free with more features planned</p>
      </S.CenterSection>

      <S.AboutMeSection>
        <h2>Who is behind El Pato Clip</h2>
        <S.AboutSectionContent>
          <div>
            <img width={100} src="/imgs/ProfilePic.png" />
            <p>Patito Dev</p>
            <S.Anchor href="https://twitch.tv/patitodev">twitch.tv/patitodev</S.Anchor>
          </div>
          <div>
            <p>El Pato Clip is an open source project actively maintained by PatitoDev, development of el pato clip can be seen on their twitch channel</p>
            <p>Everyone is welcomed to contribute and suggest ideas</p>
          </div>
        </S.AboutSectionContent>
      </S.AboutMeSection>
    </S.Page>
  )
}

export default SearchPage;