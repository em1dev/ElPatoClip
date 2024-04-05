import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '.';


const meta = {
  title: 'Atom/ProgressBar',
  component: ProgressBar,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    progress: 25,
    total: 100
  },
};