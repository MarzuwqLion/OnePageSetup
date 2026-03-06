'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { featuresContent } from '@/lib/content'
import type { FeatureIconId } from '@/lib/types'

function CameraIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="32" height="24" rx="4" stroke="#FF6B35" strokeWidth="2.5" />
      <circle cx="20" cy="22" r="7" stroke="#FF6B35" strokeWidth="2.5" />
      <circle cx="20" cy="22" r="3" fill="#FF6B35" />
      <rect x="14" y="7" width="6" height="4" rx="1.5" fill="#FF6B35" />
      <circle cx="30" cy="15" r="2" fill="#FF6B35" />
    </svg>
  )
}

function ChipIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="10" y="10" width="20" height="20" rx="4" stroke="#FF6B35" strokeWidth="2.5" />
      <rect x="15" y="15" width="10" height="10" rx="2" fill="#FF6B35" />
      <line x1="6" y1="16" x2="10" y2="16" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="24" x2="10" y2="24" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="16" x2="34" y2="16" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="24" x2="34" y2="24" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="6" x2="16" y2="10" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="6" x2="24" y2="10" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="30" x2="16" y2="34" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="30" x2="24" y2="34" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="12" width="28" height="16" rx="3" stroke="#FF6B35" strokeWidth="2.5" />
      <rect x="7" y="15" width="18" height="10" rx="2" fill="#FF6B35" />
      <path d="M33 17v6" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 19.5v1" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TitaniumIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="20,4 36,13 36,27 20,36 4,27 4,13"
        stroke="#FF6B35"
        strokeWidth="2.5"
        fill="none"
      />
      <polygon
        points="20,11 29,16 29,24 20,29 11,24 11,16"
        fill="#FF6B35"
        opacity="0.3"
      />
      <polygon
        points="20,15 25,18 25,22 20,25 15,22 15,18"
        fill="#FF6B35"
      />
    </svg>
  )
}

const iconMap: Record<FeatureIconId, React.ReactNode> = {
  camera: <CameraIcon />,
  chip: <ChipIcon />,
  battery: <BatteryIcon />,
  titanium: <TitaniumIcon />,
}

export default function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 xl:py-28 px-6 xl:px-16 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          id="features-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[28px] xl:text-[40px] font-bold text-[#1D1D1F] text-center mb-10 xl:mb-14 tracking-tight"
        >
          Everything. Elevated.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
          {featuresContent.map((feature, index) => (
            <motion.article
              key={feature.id}
              aria-label={`Feature: ${feature.title}`}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="bg-[#F5F5F7] rounded-2xl shadow-sm p-6 xl:p-8 transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:ring-offset-2"
            >
              <div className="mb-4">{iconMap[feature.icon]}</div>
              <h3 className="text-[20px] xl:text-[24px] font-semibold text-[#1D1D1F] leading-snug">
                {feature.title}
              </h3>
              <p className="text-[17px] text-[#6E6E73] mt-2 leading-relaxed">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
