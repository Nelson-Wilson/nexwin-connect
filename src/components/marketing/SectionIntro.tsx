import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Shared heading block for every landing section — keeps rhythm and type scale consistent. */
export default function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl mb-12 sm:mb-14 ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 leading-tight">
        {title}
      </h2>
      {description && <p className="text-slate-500 mt-3 text-base leading-relaxed">{description}</p>}
    </motion.div>
  );
}
