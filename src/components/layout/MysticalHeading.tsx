"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Título com cada letra surgindo aos poucos, com um leve brilho — usado nas
// seções que merecem um destaque mais "mágico" que um título comum.
export default function MysticalHeading({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  let indiceGlobal = 0;

  return (
    <div>
      <motion.h2
        className={`font-title text-4xl font-bold tracking-wide text-transparent md:text-5xl ${className}`}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="mr-3 -translate-y-1 inline-block text-pink-300"
          aria-hidden
        >
          <Sparkles className="inline size-7 md:size-9" />
        </motion.span>

        {words.map((palavra, i) => (
          <span key={i} className="inline-block whitespace-nowrap">
            {palavra.split("").map((letra, j) => {
              const delay = indiceGlobal * 0.04;
              indiceGlobal += 1;
              return (
                <motion.span
                  key={j}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.55, delay, ease: "easeOut" }}
                  className="inline-block animate-text-glow bg-gradient-to-br from-violet-100 via-pink-200 to-violet-300 bg-clip-text"
                >
                  {letra}
                </motion.span>
              );
            })}
            {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.h2>

      {/* Divisória ornamental, no mesmo espírito da usada no Hero */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: indiceGlobal * 0.04 + 0.15, ease: "easeOut" }}
        className="mt-5 flex items-center gap-3"
        aria-hidden
      >
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-pink-400/60" />
        <span className="text-xs text-pink-300">✦</span>
        <span className="h-px w-24 bg-gradient-to-l from-transparent to-violet-400/60" />
      </motion.div>
    </div>
  );
}
