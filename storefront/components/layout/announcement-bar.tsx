'use client'

import { useState } from 'react'
import { X, Truck } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-[hsl(24_35%_14%)] text-[hsl(36_30%_97%)]">
      <div className="container-custom flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm tracking-wide">
        <Truck className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.75} />
        <p>
          <span className="font-medium">Free shipping</span> on orders over ₹999 · Roasted &amp; shipped within 48 hours
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
