import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from '.';


const meta = {
  title: 'Atom/Loading',
  component: Loading,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { 
  },
};
