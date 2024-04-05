import { create } from 'zustand';
import { VideoEditSlice, useEditStateSlice } from './useEditStateSlice';
import { VideoStateSlice, useVideoStateSlice } from './useVideoStateSlice';

export const useEditorState = create<VideoEditSlice & VideoStateSlice>()((...a) => ({
  ...useVideoStateSlice(...a),
  ...useEditStateSlice(...a)
}));