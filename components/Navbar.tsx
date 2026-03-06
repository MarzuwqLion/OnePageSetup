'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Color Story', href: '#color-story' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 h-11 md:h-[52px] px-6 xl:px-16',
        'flex items-center justify-between',
        'transition-all duration-300 ease-in-out',
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#E5E5E7] shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav aria-label="Main navigation" className="flex items-center justify-between w-full">
        {/* Logo */}
        <a
          href="#hero"
          className={`text-[17px] font-semibold hover:text-[#FF6B35] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 rounded-sm ${scrolled ? 'text-[#1D1D1F]' : 'text-white'}`}
          aria-label="iPhone 17 Pro Max home"
        >
          iPhone 17
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm hover:text-[#FF6B35] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 rounded-sm ${scrolled ? 'text-[#1D1D1F]' : 'text-white'}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#pricing"
          className="hidden md:inline-flex items-center justify-center bg-[#CC5228] text-white text-sm font-medium rounded-full px-4 py-2 hover:bg-[#B34820] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2"
          aria-label="Buy iPhone 17 Pro Max Cosmic Orange"
        >
          Buy Now
        </a>

        {/* Mobile CTA pill */}
        <a
          href="#pricing"
          className="md:hidden inline-flex items-center justify-center bg-[#CC5228] text-white text-sm font-medium rounded-full px-4 py-2 hover:bg-[#B34820] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2"
          aria-label="Buy iPhone 17 Pro Max Cosmic Orange"
        >
          Buy Now
        </a>

        {/* Mobile hamburger — hidden since we show CTA instead */}
        <button
          className="hidden"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="sr-only">Menu</span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#E5E5E7] shadow-lg py-6 px-6 md:hidden"
          >
            <ul className="flex flex-col gap-4" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-lg text-[#1D1D1F] hover:text-[#FF6B35] transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
