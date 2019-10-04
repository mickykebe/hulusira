import { useEffect, useRef } from "react";

export default function useInfinteScroll(bottomOffset = 0, onLoadMore) {
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: `0px 0px ${bottomOffset}px 0px` }
    );
    const sentinelRef = ref;
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      observer.unobserve(sentinelRef.current);
    };
  }, [bottomOffset, onLoadMore, ref]);

  return ref;
}
