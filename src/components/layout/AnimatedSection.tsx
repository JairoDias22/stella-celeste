"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// ATENÇÃO: o framer-motion anima `opacity` e `transform` deste elemento. Quem usa
// AnimatedSection com `className` NÃO pode usar `transition-all` (nem transition
// em opacity/transform): o CSS passa a "suavizar" cada quadro do framer e, no fim
// da animação, o elemento dá uma piscada. Use `transition-colors` ou liste só o
// que o framer não mexe (ex.: `transition-[translate,border-color]`).
export default function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
