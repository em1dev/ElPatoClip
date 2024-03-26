import * as S from './styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ClipsResponse, UserDetails } from '../../../api/elPatoClipApi/types';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import ClipEl from '../../Molecules/ClipEl';
import ClipModal from './ClipModal';
import { useParams } from 'react-router-dom';
import { Loading } from '../../Atoms/Loading';
import { useOnIntersection } from '../../../hooks/useOnIntersection';
import { Button } from '../../Atoms/Button';
import { recentChannelsStore } from '../../../store/recentChannelsStore';

type ClipFilter = 'all time' | '24 hours' | 'last 7 days';

const generateFilter = (selectedFilter: ClipFilter) => {

  const filter: { startDate?: string, endDate?: string } = {};
  if (selectedFilter === '24 hours') {
    const yesterday =  new Date();
    yesterday.setDate(new Date().getDate() - 1);
    filter.startDate = yesterday.toISOString();
    return filter;
  }

  if (selectedFilter === 'last 7 days') {
    const yesterday =  new Date();
    yesterday.setDate(new Date().getDate() - 7);
    filter.startDate = yesterday.toISOString();
    return filter;
  }

  return filter;
};

const ITEMS_PER_PAGE = 30;

const ClipPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<ClipFilter>('all time');
  const { channelId } = useParams<{ channelId:string }>();
  const [channelDetails, setChannelDetails] = useState<UserDetails | null>(null);

  const modalContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [clips, setClips] = useState<ClipsResponse | null>(null);

  const selectedClip = clips?.data.find(clip => clip.id === selectedClipId);

  useEffect(() => {
    (async () => {
      if (!channelId) return;
      const userDetailsResponse = await ElPatoApi.getChannelDetails(channelId);
      setChannelDetails(userDetailsResponse);

      recentChannelsStore.store({
        id: userDetailsResponse.id,
        displayName: userDetailsResponse.display_name,
        profileImg: userDetailsResponse.profile_image_url,
      });
    })();
  }, [channelId]);

  const loadPage = useCallback(async (
    cursor?: string,
    startDate?: string,
    cancellationToken?: { shouldCancel: boolean }
  ) => {

    if (!channelId) return;
    setIsLoading(true);

    const resp = await ElPatoApi.getClips(channelId, {
      amount: ITEMS_PER_PAGE,
      afterCursor: cursor,
      startedAt: startDate
    });

    if (cancellationToken?.shouldCancel) return;
    setClips((prev) => ({
      data: [...prev?.data ?? [], ...resp.data],
      pagination: resp.pagination,
    }));
    setIsLoading(false);
  }, [channelId]);

  useEffect(() => {
    const cancellationToken = { shouldCancel: false };
    (async () => {
      setClips(null);
      const startDate = generateFilter(selectedFilter).startDate;
      await loadPage(undefined, startDate, cancellationToken);
    })();

    return () => {
      cancellationToken.shouldCancel = true;
    };
  }, [loadPage, selectedFilter]);

  const loaderTriggerRef = useOnIntersection<HTMLButtonElement>(useCallback(() => {
    if (isLoading) return;
    if (!clips || clips.pagination.cursor) {
      const startDate = generateFilter(selectedFilter).startDate;
      loadPage(clips?.pagination.cursor, startDate);
    }
    // no more to load
  }, [clips, loadPage, selectedFilter, isLoading]));

  useEffect(() => {
    if (selectedClip) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    const el = modalContainerRef.current;
    const onBodyClick = (e: MouseEvent) => {
      if (!selectedClip) return;
      if (e.target !== el) return;
      setSelectedClipId(null);
    };

    el?.addEventListener('click', onBodyClick);
    return () => {
      el?.removeEventListener('click', onBodyClick);
    };
  }, [selectedClip]);

  return (
    <S.Page>
      { channelDetails && (
        <S.Header>
          <S.ProfileDetails>
            <img alt={`${channelDetails.display_name}`} src={channelDetails.profile_image_url} />
            <div>{channelDetails.display_name}</div>
          </S.ProfileDetails>

          <div>Best of</div>
          <S.FilterContainer>
            <Button 
              onClick={() => setSelectedFilter('all time')} 
              theme={selectedFilter === 'all time' ? 'light' : 'dark'}
            >All time</Button>
            <Button 
              onClick={() => setSelectedFilter('24 hours')} 
              theme={selectedFilter === '24 hours' ? 'light' : 'dark'}
            >Last 24 hours</Button>
            <Button 
              onClick={() => setSelectedFilter('last 7 days')} 
              theme={selectedFilter === 'last 7 days' ? 'light' : 'dark'}
            >Last 7 Days</Button>
          </S.FilterContainer>
        </S.Header>
      )}

      {selectedClip && (
        <S.ModalOverlay ref={modalContainerRef}>
          <ClipModal clip={selectedClip} />
        </S.ModalOverlay>
      )}

      <S.Container>
        {clips?.data.map((clip, index) => (
          <ClipEl 
            ref={(index === clips.data.length - 1) ? loaderTriggerRef : undefined} 
            key={clip.id} clip={clip} onClick={() => setSelectedClipId(clip.id)} 
          />
        ))}

        {clips?.data.length === 0 && (
          <S.InfoLabel>No clips where found</S.InfoLabel>
        )}

        {isLoading && (
          <S.LoadingContainer>
            <Loading />
          </S.LoadingContainer>
        )}
      </S.Container>
    </S.Page>
  );
};

export default ClipPage;
