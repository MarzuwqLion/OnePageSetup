'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { colorStoryContent } from '@/lib/content'

export default function ColorStorySection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="color-story"
      aria-labelledby="color-story-heading"
      className="py-20 xl:py-28 bg-[#1D1D1F]"
    >
      <div className="max-w-5xl mx-auto px-6 xl:px-16 text-center">
        {/* Color swatch block */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-[120px] h-[120px] xl:w-[200px] xl:h-[200px] rounded-3xl shadow-lg mx-auto mb-8"
          style={{ backgroundColor: '#FF6B35' }}
          aria-hidden="true"
        />

        {/* Headline */}
        <motion.h2
          id="color-story-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[28px] xl:text-[40px] font-bold text-white tracking-tight mb-4"
        >
          {colorStoryContent.headline}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[17px] xl:text-[21px] text-[#A1A1A6] max-w-xl mx-auto leading-relaxed"
        >
          {colorStoryContent.description}
        </motion.p>

        {/* Phone renders */}
        <div className="flex flex-col md:flex-row justify-center gap-6 xl:gap-8 mt-12 items-center">
          {colorStoryContent.images.map((img, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.5,
                delay: prefersReducedMotion ? 0 : 0.1 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex-shrink-0"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(max-width: 768px) 120px, 160px"
                className="object-contain rounded-2xl w-[280px] md:w-[220px] xl:w-[280px] h-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
