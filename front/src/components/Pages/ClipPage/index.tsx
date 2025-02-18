import * as S from './styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChannelDetails, ClipsResponse } from '../../../api/elPatoClipApi/types';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import ClipEl from '../../Molecules/ClipEl';
import ClipModal from './ClipModal';
import { useParams } from 'react-router-dom';
import { Loading } from '../../Atoms/Loading';
import { useOnIntersection } from '../../../hooks/useOnIntersection';
import { Button } from '../../Atoms/Button';
import { recentChannelsStore } from '../../../store/recentChannelsStore';
import { ApiResponse } from '../../../api/types';

const ITEMS_PER_PAGE = 30;
type ClipFilter = 'all time' | '24 hours' | 'last 7 days' | 'last 30 days';

const ClipFilterToDisplayName: Record<ClipFilter, { displayName: string, daysToSubtract: number}> = {
  'all time': { displayName: 'All time', daysToSubtract: 0 },
  '24 hours': { displayName: 'Last 24 hours', daysToSubtract: 1 },
  'last 7 days': { displayName: 'Last 7 days', daysToSubtract: 7 },
  'last 30 days': { displayName: 'Last 30 days', daysToSubtract: 30 },
};

const generateFilter = (selectedFilter: ClipFilter) => {
  const filter: { startDate?: string, endDate?: string } = {};
  if (selectedFilter === 'all time') return filter;

  const today = new Date();
  today.setHours(0,0,0,0); //reset to midnight

  const { daysToSubtract } = ClipFilterToDisplayName[selectedFilter];
  const startDate = (new Date(today));
  startDate.setDate(today.getDate() - daysToSubtract);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  filter.endDate = tomorrow.toISOString();
  filter.startDate = startDate.toISOString();
  return filter;
};

const ClipPage = () => {
  const { channelId } = useParams<{ channelId:string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<ClipFilter>('all time');
  const [channelDetails, setChannelDetails] = useState<ApiResponse<ChannelDetails> | null>(null);
  const [clips, setClips] = useState<ApiResponse<ClipsResponse> | null>(null);

  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const selectedClip = clips?.data?.data.find(clip => clip.id === selectedClipId);

  const modalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!channelId) return;
      const userDetailsResponse = await ElPatoApi.getChannelDetails(channelId);
      setChannelDetails(userDetailsResponse);

      if (userDetailsResponse.error) return;

      recentChannelsStore.store({
        id: userDetailsResponse.data.id,
        displayName: userDetailsResponse.data.display_name,
        profileImg: userDetailsResponse.data.profile_image_url,
      });
    })();
  }, [channelId]);

  const loadPage = useCallback(async (
    cursor?: string,
    startDate?: string,
    endDate?: string,
    cancellationToken?: { shouldCancel: boolean }
  ) => {

    if (!channelId) return;
    setIsLoading(true);

    const resp = await ElPatoApi.getClips(channelId, {
      amount: ITEMS_PER_PAGE,
      afterCursor: cursor,
      startedAt: startDate,
      endedAt: endDate
    });

    if (cancellationToken?.shouldCancel) return;

    if (resp.error) {
      setIsLoading(false);
      setClips(resp);
      return;
    }

    setClips((prev) => {
      // sort the response, we don't sort the total list in case twitch api returns unsorted data (which it does :v)
      // sort by view count as that seems to be what twitch paginates by
      const respDataSorted = resp.data.data.toSorted((clipA, clipB) => (
        clipB.view_count - clipA.view_count
      ));

      if (prev?.error || prev === null) {
        return {
          ...resp,
          data: {
            ...resp.data,
            data: respDataSorted,
          }
        };
      }

      return ({
        error: false,
        status: resp.status,
        data: {
          pagination: resp.data.pagination,
          data: [...prev.data.data ?? [], 
            ...respDataSorted
          ]
        },
      });
    });
    setIsLoading(false);
  }, [channelId]);

  useEffect(() => {
    const cancellationToken = { shouldCancel: false };
    (async () => {
      setClips(null);
      const filter = generateFilter(selectedFilter);
      await loadPage(undefined, filter.startDate, filter.endDate, cancellationToken);
    })();

    return () => {
      cancellationToken.shouldCancel = true;
    };
  }, [loadPage, selectedFilter]);

  const loaderTriggerRef = useOnIntersection<HTMLButtonElement>(useCallback(() => {
    if (isLoading) return;
    if (clips === null || clips.data?.pagination.cursor) {
      const filter = generateFilter(selectedFilter);
      loadPage(clips?.data?.pagination.cursor, filter.startDate, filter.endDate);
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
      {(channelDetails?.error || clips?.error) && (
        <S.Header>
          <S.ProfileDetails>
            <div>Error loading clips, please try again later.</div>
          </S.ProfileDetails>
        </S.Header>
      )}

      { channelDetails?.data && (
        <S.Header>
          <S.ProfileDetails>
            <img alt={`${channelDetails.data.display_name}`} src={channelDetails.data.profile_image_url} />
            <div>{channelDetails.data.display_name}</div>
          </S.ProfileDetails>

          <div>Most viewed clips from</div>
          <S.FilterContainer>
            {Object.keys(ClipFilterToDisplayName).map(key => {
              const { displayName } = ClipFilterToDisplayName[key as ClipFilter];
              return (
                <Button
                  key={key}
                  onClick={() => setSelectedFilter(key as ClipFilter)} 
                  $variant={selectedFilter === key ? 'primary' : 'outline'}
                >{displayName}</Button>
              );
            })}
          </S.FilterContainer>
        </S.Header>
      )}

      {selectedClip && (
        <S.ModalOverlay ref={modalContainerRef}>
          <ClipModal clip={selectedClip} />
        </S.ModalOverlay>
      )}

      <S.Container>
        {clips?.data?.data.map((clip, index) => (
          <ClipEl 
            ref={(index === clips.data.data.length - 1) ? loaderTriggerRef : undefined} 
            key={clip.id} clip={clip} onClick={() => setSelectedClipId(clip.id)} 
          />
        ))}

        {clips?.data?.data.length === 0 && (
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
