'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description, details }: ProductAccordionProps) {
  return (
    <div className="border-t">
      {description && (
        <AccordionItem title="Description" defaultOpen>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionItem>
      )}

      <AccordionItem title="Shipping & Returns">
        <ul className="space-y-2">
          <li>Free shipping on orders over ₹999 across India</li>
          <li>Roasted &amp; dispatched within 48 hours of order</li>
          <li>Standard delivery: 3–5 business days</li>
          <li>Express delivery available at checkout</li>
          <li>30-day freshness guarantee — full refund if not delighted</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="How to store">
        <ul className="space-y-2">
          <li>Keep in the original valve-sealed bag — it&apos;s purpose-built for freshness</li>
          <li>Store at room temperature, away from sunlight and heat</li>
          <li>Do not refrigerate or freeze (moisture is coffee&apos;s enemy)</li>
          <li>Best within 60 days of roast · peak flavour weeks 2–4</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Brewing tips">
        <ul className="space-y-2">
          <li>Use filtered water, just off the boil (92–96°C)</li>
          <li>Ratio: 1:15 to 1:17 coffee-to-water for filter methods</li>
          <li>Grind just before you brew for maximum aroma</li>
          <li>Every bag includes a printed brew guide</li>
        </ul>
      </AccordionItem>
    </div>
  )
}
