import { SHORT_FRAME_HEIGHT, useLayoutStore } from './layout';

export function useDerivedLayoutState() {
  const frameSize = useLayoutStore((store) => store.frameSize);
  return { isShortFrame: frameSize.height === SHORT_FRAME_HEIGHT };
}
