"use client";

import { useEffect, useRef, useState } from "react";

export function TypedText({ phrases, className }: { phrases: string[]; className?: string }) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeRef = useRef<number | null>(null);

  useEffect(() => {
    const current = phrases[i % phrases.length];
    let delay = deleting ? 30 : 70;

    if (!deleting && text === current) {
      delay = 1900;
      timeRef.current = window.setTimeout(() => setDeleting(true), delay);
      return () => {
        if (timeRef.current) clearTimeout(timeRef.current);
      };
    }
    if (deleting && text === "") {
      timeRef.current = window.setTimeout(() => {
        setDeleting(false);
        setI((v) => (v + 1) % phrases.length);
      }, 350);
      return () => {
        if (timeRef.current) clearTimeout(timeRef.current);
      };
    }

    timeRef.current = window.setTimeout(
      () => setText(current.slice(0, text.length + (deleting ? -1 : 1))),
      delay
    );
    return () => {
      if (timeRef.current) clearTimeout(timeRef.current);
    };
  }, [text, deleting, i, phrases]);

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse-soft bg-cyan" style={{ height: "1em" }} />
    </span>
  );
}
