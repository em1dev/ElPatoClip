import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '.';


const meta = {
  title: 'Atom/Select',
  component: Select,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <option value="1">Value 1</option>
        <option value="2">Value 2</option>
        <option value="3">Value 3</option>
        <option value="4">Value 4</option>
        <option value="5">Value 5</option>
      </>
    )
  },
};