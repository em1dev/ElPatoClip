import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '.';


const meta = {
  title: 'Atom/Badge',
  component: Badge,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Badge'
  },
};