import React, { MutableRefObject, RefCallback } from 'react';

type ReactRef<T> = RefCallback<T | null> | MutableRefObject<T | null> | null;

function useCombinedRefs<T>(
  ...refs: ReactRef<T>[]
): React.MutableRefObject<T | null> {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
export default useCombinedRefs;
