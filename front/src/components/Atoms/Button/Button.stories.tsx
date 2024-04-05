import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '.';

const meta = {
  title: 'Atom/Button',
  component: Button,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    $variant: 'primary',
    children: 'Button',
    disabled: false
  },
};

export const PrimaryDisabled: Story = {
  args: {
    $variant: 'primary',
    children: 'Button',
    disabled: true
  },
};

export const Outline: Story = {
  args: {
    $variant: 'outline',
    children: 'Button',
    disabled: false
  },
};

export const Secondary: Story = {
  args: {
    $variant: 'secondary',
    children: 'Button',
    disabled: false
  },
};

export const White: Story = {
  args: {
    $variant: 'white',
    children: 'Button',
    disabled: false
  },
};