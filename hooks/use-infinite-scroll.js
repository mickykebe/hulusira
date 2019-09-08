import { useEffect, useState } from "react";
import throttle from "lodash.throttle";

export default function useInfiniteScroll(
  isFetching,
  hasMore,
  onLoadMore,
  disabled = false,
  threshold = 50
) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if(isFetching || !shouldLoad || !hasMore) {
      return;
    }
    onLoadMore();
    setShouldLoad(false);
  }, [hasMore, isFetching, onLoadMore, shouldLoad]);

  useEffect(() => {
    const handleScroll = () => {
      if(disabled) {
        return;
      }

      if(window.innerHeight + document.documentElement.scrollTop + threshold >
        document.documentElement.offsetHeight) {
        setShouldLoad(true);
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 500);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    }
  }, [threshold, disabled]);
}
