'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { heroContent } from '@/lib/content'

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="min-h-screen bg-black flex flex-col items-center justify-center pt-16 pb-12 px-6 text-center gap-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center gap-4 w-full"
      >
        {/* Headline */}
        <h1
          id="hero-heading"
          className="text-[36px] xl:text-[64px] font-bold text-white leading-tight tracking-tight"
        >
          {heroContent.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-[24px] xl:text-[32px] font-semibold text-[#FF6B35]">
          {heroContent.subheadline}
        </p>

        {/* Tagline */}
        <p className="text-[17px] text-white/60">{heroContent.tagline}</p>

        {/* Product image */}
        <div className="relative w-[300px] md:w-[420px] xl:w-[560px] mx-auto my-6">
          <Image
            src={heroContent.image.src}
            alt={heroContent.image.alt}
            width={heroContent.image.width}
            height={heroContent.image.height}
            priority={true}
            sizes="(max-width: 768px) 280px, (max-width: 1440px) 360px, 480px"
            className="object-contain w-full h-auto"
          />
        </div>

        {/* Price */}
        <p className="text-[15px] text-white/50">
          <span aria-label="Starting from $1,199">{heroContent.price}</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center mt-2">
          <a
            href="#pricing"
            className="flex items-center justify-center w-full sm:w-[200px] h-14 bg-[#CC5228] text-white font-medium text-[17px] rounded-2xl shadow-sm transition-all duration-200 ease-in-out hover:bg-[#B34820] hover:scale-[1.02] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 active:bg-[#993D1A] active:scale-[0.98]"
            aria-label="Buy iPhone 17 Pro Max Cosmic Orange"
          >
            {heroContent.ctaPrimary}
          </a>
          <a
            href="#features"
            className="flex items-center justify-center w-full sm:w-[200px] h-14 bg-transparent border border-[#FF6B35] text-[#FF6B35] font-medium text-[17px] rounded-2xl transition-all duration-200 ease-in-out hover:bg-[#FFF3EE] hover:border-[#CC5228] hover:text-[#CC5228] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 active:bg-[#FFE8DC] active:scale-[0.98]"
            aria-label="Learn more about iPhone 17 Pro Max"
          >
            {heroContent.ctaSecondary}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
