import ***REMOVED*** useEffect, useState ***REMOVED*** from "react";
import throttle from "lodash.throttle";

export default function useInfiniteScroll(
  isFetching,
  hasMore,
  onLoadMore,
  disabled = false,
  threshold = 50
) ***REMOVED***
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => ***REMOVED***
    if(isFetching || !shouldLoad || !hasMore) ***REMOVED***
      return;
    ***REMOVED***
    onLoadMore();
    setShouldLoad(false);
  ***REMOVED***, [hasMore, isFetching, onLoadMore, shouldLoad]);

  useEffect(() => ***REMOVED***
    const handleScroll = () => ***REMOVED***
      if(disabled) ***REMOVED***
        return;
      ***REMOVED***

      if(window.innerHeight + document.documentElement.scrollTop + threshold >
        document.documentElement.offsetHeight) ***REMOVED***
        setShouldLoad(true);
      ***REMOVED***
    ***REMOVED***;

    const throttledHandleScroll = throttle(handleScroll, 500);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => ***REMOVED***
      window.removeEventListener('scroll', throttledHandleScroll);
    ***REMOVED***
  ***REMOVED***, [threshold, disabled]);
***REMOVED***
