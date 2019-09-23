import { useEffect, useState } from "react";
import throttle from "lodash.throttle";

export default function useInfiniteScroll(
  isFetching,
  hasMore,
  onLoadMore,
  disabled = false,
  threshold = 50
) {
  const [scrollDownTrigger, setScrollDownTrigger] = useState(false);

  useEffect(() => {
    if (isFetching || !scrollDownTrigger || !hasMore) {
      return;
    }
    onLoadMore();
    setScrollDownTrigger(false);
  }, [hasMore, isFetching, onLoadMore, scrollDownTrigger]);

  useEffect(() => {
    const handleScroll = () => {
      if (disabled) {
        return;
      }

      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >
        document.documentElement.offsetHeight
      ) {
        setScrollDownTrigger(true);
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [threshold, disabled]);
}
