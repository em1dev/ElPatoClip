import { Layer } from '../types';

export const addNewLayer = (layers: Array<Layer>) => {
  const lastIndex = layers
    .sort((a, b) => a.zIndex - b.zIndex)
    .at(-1);
  const zIndex = (lastIndex?.zIndex ?? 0) + 1;
  const lastId = layers
    .sort((a,b) => a.id - b.id)
    .at(-1);
  const id = (lastId?.id ?? 0) + 1;
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padEnd(6, '0');
  const newLayer: Layer = {
    id,
    name: `Layer ${id}`,
    borderColor: randomColor,
    zIndex,
    input: { rect: { x: 0, y: 0, width: 500, height: 500 } },
    output: { rect: { x: 0, y: 0, width: 500, height: 500 } },
    locked: false,
    filter: 'none',
    aspect: 'free',
    shape: 'rectangle',
  };
  return [...layers, newLayer];
};

const landscapeWithCamTemplate: Array<Layer> = [
  {
    'id': 0,
    'name': 'Layer 0',
    'borderColor': '#FF0099',
    'shape': 'circle',
    'zIndex': 2,
    'input': {
      'rect': {
        'x': 1483,
        'y': 540,
        'height': 539,
        'width': 436
      }
    },
    'output': {
      'rect': {
        'x': 0,
        'y': 0,
        'height': 798,
        'width': 1080
      }
    },
    'locked': false,
    'filter': 'none',
    'aspect': 'free'
  },
  {
    'id': 2,
    'name': 'Layer 1',
    'shape': 'round-rectangle',
    'borderColor': '#0066FF',
    'zIndex': 1,
    'input': {
      'rect': {
        'x': 0,
        'y': 0,
        'height': 1080,
        'width': 1920,
      }
    },
    'output': {
      'rect': {
        'x': 155,
        'y': 1149,
        'width': 800,
        'height': 450
      }
    },
    'locked': false,
    'filter': 'none',
    'aspect': 'free'
  },
  {
    'id': 1,
    'name': 'Layer 2',
    'shape': 'rectangle',
    'borderColor': '#eeff00',
    'zIndex': 0,
    'input': {
      'rect': {
        'x': 463,
        'y': 0,
        'width': 1080,
        'height': 1080
      }
    },
    'output': {
      'rect': {
        'x': 0,
        'y': 0,
        'width': 1080,
        'height': 1920
      }
    },
    'locked': false,
    'filter': 'blur',
    'aspect': 'free'
  }
];

export const defaultLayers: Array<Layer> = landscapeWithCamTemplate;