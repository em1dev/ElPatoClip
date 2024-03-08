import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '.';


const meta = {
  title: 'Atom/Input',
  component: Input,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { 
  },
}

export const Small: Story = {
  args: { 
    size: 'sm'
  },
}

export const Placeholder: Story = {
  args: { 
    placeholder: 'Twitch channel name'
  },
}