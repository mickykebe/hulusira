import ***REMOVED*** useEffect, useRef ***REMOVED*** from "react";

export default function useInfinteScroll(bottomOffset = 0, onLoadMore) ***REMOVED***
  const ref = useRef();
  useEffect(() => ***REMOVED***
    const observer = new IntersectionObserver(
      ([entry]) => ***REMOVED***
        if (entry.isIntersecting) ***REMOVED***
          onLoadMore();
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED*** rootMargin: `0px 0px $***REMOVED***bottomOffset***REMOVED***px 0px` ***REMOVED***
    );
    const sentinelRef = ref;
    if (sentinelRef.current) ***REMOVED***
      observer.observe(sentinelRef.current);
    ***REMOVED***
    return () => ***REMOVED***
      observer.unobserve(sentinelRef.current);
    ***REMOVED***;
  ***REMOVED***, [bottomOffset, onLoadMore, ref]);

  return ref;
***REMOVED***
