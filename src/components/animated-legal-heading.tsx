"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type Props = {
  level: 1 | 2;
  text: string;
  className: string;
  id?: string;
};

export function AnimatedLegalHeading({ level, text, className, id }: Props) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -15% 0px" });
  const animate = useSplitWordsAnimate(inView);
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <Tag ref={ref} id={id} className={className}>
      <SplitWords
        as="span"
        text={text}
        stagger={level === 1 ? 0.048 : 0.04}
        delayStart={level === 1 ? 0.05 : 0.03}
        animate={animate}
      />
    </Tag>
  );
}
