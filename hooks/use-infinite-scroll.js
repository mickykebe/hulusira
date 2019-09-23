import ***REMOVED*** useEffect, useState ***REMOVED*** from "react";
import throttle from "lodash.throttle";

export default function useInfiniteScroll(
  isFetching,
  hasMore,
  onLoadMore,
  disabled = false,
  threshold = 50
) ***REMOVED***
  const [scrollDownTrigger, setScrollDownTrigger] = useState(false);

  useEffect(() => ***REMOVED***
    if (isFetching || !scrollDownTrigger || !hasMore) ***REMOVED***
      return;
    ***REMOVED***
    onLoadMore();
    setScrollDownTrigger(false);
  ***REMOVED***, [hasMore, isFetching, onLoadMore, scrollDownTrigger]);

  useEffect(() => ***REMOVED***
    const handleScroll = () => ***REMOVED***
      if (disabled) ***REMOVED***
        return;
      ***REMOVED***

      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >
        document.documentElement.offsetHeight
      ) ***REMOVED***
        setScrollDownTrigger(true);
      ***REMOVED***
    ***REMOVED***;

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener("scroll", throttledHandleScroll);
    return () => ***REMOVED***
      window.removeEventListener("scroll", throttledHandleScroll);
    ***REMOVED***;
  ***REMOVED***, [threshold, disabled]);
***REMOVED***
