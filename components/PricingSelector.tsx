'use client'

import { useState } from 'react'

interface StorageTier {
  id: string
  label: string
  price: string
  monthly: string
}

const storageTiers: StorageTier[] = [
  { id: '128gb', label: '128GB', price: '$1,199', monthly: '$49.91/mo.' },
  { id: '256gb', label: '256GB', price: '$1,329', monthly: '$55.37/mo.' },
  { id: '512gb', label: '512GB', price: '$1,599', monthly: '$66.62/mo.' },
]

export default function PricingSelector() {
  const [selected, setSelected] = useState<string>('128gb')

  const selectedTier = storageTiers.find((t) => t.id === selected) ?? storageTiers[0]

  return (
    <div className="w-full">
      {/* Storage tier selector */}
      <div
        className="flex flex-row gap-3 justify-center mb-6"
        role="radiogroup"
        aria-label="Select storage capacity"
      >
        {storageTiers.map((tier) => (
          <button
            key={tier.id}
            role="radio"
            aria-checked={selected === tier.id}
            onClick={() => setSelected(tier.id)}
            className={[
              'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ease-in-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2',
              selected === tier.id
                ? 'border-[#CC5228] bg-[#FFF3EE] text-[#CC5228]'
                : 'border-[#E5E5E7] bg-white text-[#6E6E73] hover:border-[#CC5228] hover:text-[#CC5228]',
            ].join(' ')}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Selected tier price */}
      <p className="text-[36px] xl:text-[48px] font-bold text-[#1D1D1F] text-center leading-none mb-2">
        {selectedTier.price}
      </p>
      <p className="text-[15px] text-[#6E6E73] text-center mb-2">
        Starting at {selectedTier.monthly} for 24 months.
      </p>
    </div>
  )
}
