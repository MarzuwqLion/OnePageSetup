'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    const pricing = document.getElementById('pricing')
    if (!hero) return

    let heroGone = false
    let pricingVisible = false

    const update = () => setVisible(heroGone && !pricingVisible)

    const heroObs = new IntersectionObserver(
      ([entry]) => { heroGone = !entry.isIntersecting; update() },
      { threshold: 0 }
    )
    heroObs.observe(hero)

    if (pricing) {
      const pricingObs = new IntersectionObserver(
        ([entry]) => { pricingVisible = entry.isIntersecting; update() },
        { threshold: 0 }
      )
      pricingObs.observe(pricing)
      return () => { heroObs.disconnect(); pricingObs.disconnect() }
    }

    return () => heroObs.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E5E7] px-6 py-3 flex items-center justify-between"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          aria-live="polite"
        >
          <span className="text-[17px] font-semibold text-[#1D1D1F]">From $1,199</span>
          <a
            href="#pricing"
            className="bg-[#CC5228] text-white text-sm font-medium rounded-full px-6 py-2 hover:bg-[#B34820] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2"
            aria-label="Buy iPhone 17 Pro Max Cosmic Orange"
          >
            Buy Now
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
