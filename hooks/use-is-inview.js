import ***REMOVED*** useEffect, useRef, useState ***REMOVED*** from "react";

export default function useIsInview(bottomOffset = 0) ***REMOVED***
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef();
  useEffect(() => ***REMOVED***
    const observer = new IntersectionObserver(
      ([entry]) => ***REMOVED***
        setIsIntersecting(entry.isIntersecting);
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
  ***REMOVED***, [bottomOffset, isIntersecting, ref]);

  return [isIntersecting, ref];
***REMOVED***
