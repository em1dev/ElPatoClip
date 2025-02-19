import type { Meta, StoryObj } from '@storybook/react';
import { ButtonIcon } from '.';


const meta = {
  title: 'Atom/ButtonIcon',
  component: ButtonIcon,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { 
    title: 'button icon',
    iconName: 'DualCanvasIcon.svg'
  },
};

export const Selected: Story = {
  args: { 
    title: 'button icon',
    iconName: 'DualCanvasIcon.svg',
    selected: true
  },
};

export const Disabled: Story = {
  args: { 
    title: 'button icon',
    iconName: 'DualCanvasIcon.svg',
    disabled: true
  },
};