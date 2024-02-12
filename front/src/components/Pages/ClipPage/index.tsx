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

const ClipPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<ClipFilter>('all time');
  const { channelId } = useParams<{ channelId:string }>();
  const [channelDetails, setChannelDetails] = useState<UserDetails | null>(null);

  const loaderTriggerRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [clips, setClips] = useState<ClipsResponse | null>(null);

  const selectedClip = clips?.data.find(clip => clip.id === selectedClipId);

  const loadData = useCallback(async (cursor?: string, startDate?: string) => {
    if (!channelId) return;
    setIsLoading(true);
    const userDetailsResponse = await ElPatoApi.getChannelDetails(channelId);
    setChannelDetails(userDetailsResponse);

    const resp = await ElPatoApi.getClips(channelId, {
      amount: 30,
      afterCursor: cursor,
      startedAt: startDate
    });
    setClips((prev) => ({
      data: [...prev?.data ?? [], ...resp.data],
      pagination: resp.pagination,
    }));
    setIsLoading(false);
  }, [channelId]);

  useEffect(() => {
    setClips(null);
  }, [selectedFilter]);

  useOnIntersection(loaderTriggerRef, useCallback(() => {
    if (!clips || clips.pagination.cursor) {
      const startDate = generateFilter(selectedFilter).startDate;
      loadData(clips?.pagination.cursor, startDate);
    }
    // no more to load
  }, [clips, loadData, selectedFilter]));

  useEffect(() => {
    const el = modalContainerRef.current;
    const onBodyClick = (e: MouseEvent) => {
      if (!selectedClip) return;
      if (e.target !== el) return;
      setSelectedClipId(null);
    };

    el?.addEventListener('click', onBodyClick);
    return () => {
      el?.removeEventListener('click', onBodyClick);
    }
  }, [selectedClip]);

  return (
    <S.Page>
    { channelDetails && (
      <S.Header>
          <S.ProfileDetails>
            <img alt={`${channelDetails.display_name}`} src={channelDetails.profile_image_url} />
            <div>{channelDetails.display_name}</div>
          </S.ProfileDetails>

          <S.FilterContainer>
            <span>Best of</span>
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
      {clips?.data.map((clip) => (
          <ClipEl key={clip.id} clip={clip} onClick={() => setSelectedClipId(clip.id)} />
      ))}

      <div ref={loaderTriggerRef}></div>

      {isLoading && (
        <S.LoadingContainer>
          <Loading />
        </S.LoadingContainer>
      )}
    </S.Container>
  </S.Page>
  )
}

export default ClipPage
