"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState("0");
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 300,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Intl.NumberFormat("en-US").format(latest.toFixed(0)));
    });
    
    return unsubscribe;
  }, [springValue]);

  return (
    <span
      className={`inline-block tabular-nums ${className}`}
      ref={ref}
    >
      {displayValue}
    </span>
  );
}