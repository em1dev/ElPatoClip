import type { Preview } from "@storybook/react";
import '../src/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'base',
      values: [{
        name: 'base',
        value: '#2B2B2B'
      }]
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
