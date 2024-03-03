import type { Meta, StoryObj } from '@storybook/react';
import { EditorSideBar } from '.';
import { addNewLayer, defaultLayers } from '../../../../Utils/LayerGenerator';
import { useState } from 'react';


const meta = {
  title: 'Editor/SideBar',
  component: EditorSideBar,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof EditorSideBar>

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    layers: defaultLayers,
    selectedLayerId: 0
  },
  decorators: [(Story) => {
    const [layers, setLayers] = useState(defaultLayers);
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(0);

    return (
      <Story args={{ layers, setLayers, setSelectedLayerId, selectedLayerId }} />
      )
  }]
};

let longList = defaultLayers;
longList = addNewLayer(longList);
longList = addNewLayer(longList);
longList = addNewLayer(longList);
longList = addNewLayer(longList);
longList = addNewLayer(longList);

export const LongList: Story = {
  args: {
    layers: longList,
    selectedLayerId: 0
  },
  decorators: [(Story) => {
    const [layers, setLayers] = useState(longList);
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);

    return (
      <Story args={{ layers, setLayers, setSelectedLayerId, selectedLayerId }} />
      )
  }]
};