import { useEffect, useRef, useState } from "react";

export default function useIsInview(bottomOffset = 0) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
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
  }, [bottomOffset, isIntersecting, ref]);

  return [isIntersecting, ref];
}
