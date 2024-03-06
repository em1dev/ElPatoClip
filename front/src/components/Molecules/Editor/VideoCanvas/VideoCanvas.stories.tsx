import type { Meta, StoryObj } from '@storybook/react';
import { defaultLayers } from '../../../../Utils/LayerGenerator';
import { useEffect, useRef, useState } from 'react';
import { VideoCanvas } from '.';
import { Layer, Source } from '../../../../types';
import { styled } from 'styled-components';


const meta = {
  title: 'Editor/VideoCanvas',
  component: VideoCanvas,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof VideoCanvas>

export default meta;
type Story = StoryObj;

const Container = styled.div`
  width: 80vw;
  height: 80vh;
  > * {
    width: 100%;
    height: 100%;
  }
`;

export const Primary: Story = {
  decorators: [(Story) => {
    const videoRef = useRef<HTMLCanvasElement>(null);
    const [layers, setLayers] = useState(defaultLayers);
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
    const [hoverLayerId, setHoverLayerId] = useState<number | null>(null);

    useEffect(() => {
      if (!videoRef.current) return;
      const ctx = videoRef.current.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = 'rgb(200,200,200)';
      ctx.fillRect(0,0, 1920, 1080);
    }, [videoRef]);

    const onOutputChange = (id: number, output: Source) => {
      setLayers(prev => (
        prev.map(i => i.id !== id ? i : {
          ...i,
          output: output
        } satisfies Layer)
      ));
    }

    return (
      <Container>
        <canvas hidden width={1920} height={1080} ref={videoRef} />
        <Story args={{ 
          withPadding: true,
          hoverLayerId: hoverLayerId,
          setHoverLayerId: setHoverLayerId,
          renderVideo: true,
          layers, 
          setSelectedLayerId, 
          selectedLayerId,
          videoRef,
          onOutputChange,
        }} />
      </Container>
      )
  }]
};