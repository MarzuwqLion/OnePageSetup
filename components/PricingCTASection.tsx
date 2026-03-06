'use client'

import { motion, useReducedMotion } from 'framer-motion'
import PricingSelector from '@/components/PricingSelector'
import { pricingContent } from '@/lib/content'

export default function PricingCTASection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-20 xl:py-28 bg-[#F5F5F7]"
    >
      <motion.div
        className="max-w-3xl mx-auto px-6 xl:px-16 text-center"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Section heading */}
        <h2
          id="pricing-heading"
          className="text-[24px] xl:text-[32px] font-semibold text-[#1D1D1F] mb-8 tracking-tight"
        >
          {pricingContent.headline}
        </h2>

        {/* Interactive pricing selector (client island) */}
        <PricingSelector />

        {/* Benefits */}
        <p className="text-[14px] text-[#6E6E73] mt-4 mb-8">{pricingContent.benefits}</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a
            href="#"
            className="flex items-center justify-center w-full sm:w-[200px] h-14 bg-[#CC5228] text-white font-medium text-[17px] rounded-2xl shadow-sm transition-all duration-200 ease-in-out hover:bg-[#B34820] hover:scale-[1.02] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 active:bg-[#993D1A] active:scale-[0.98]"
            aria-label="Buy iPhone 17 Pro Max Cosmic Orange"
          >
            {pricingContent.ctaPrimary}
          </a>
          <a
            href="#features"
            className="flex items-center justify-center w-full sm:w-[200px] h-14 bg-transparent border border-[#FF6B35] text-[#FF6B35] font-medium text-[17px] rounded-2xl transition-all duration-200 ease-in-out hover:bg-[#FFF3EE] hover:border-[#CC5228] hover:text-[#CC5228] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 active:bg-[#FFE8DC] active:scale-[0.98]"
            aria-label="Learn more about iPhone 17 Pro Max"
          >
            {pricingContent.ctaSecondary}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
