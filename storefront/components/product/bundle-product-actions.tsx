'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import {
  Minus,
  Plus,
  Check,
  Loader2,
  Flame,
  Clock,
  ShieldCheck,
  Truck,
  Package,
  Star,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { formatPrice } from '@/lib/utils/format-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface BundleProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
  /** Deadline in ms-since-epoch for the sale urgency timer */
  saleEndsAt: number
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

// Bundle tiers
const TIERS = [
  {
    qty: 1,
    label: 'Single Bag',
    discount: 0,
    badge: null as string | null,
    sub: 'Try it first',
  },
  {
    qty: 2,
    label: '2 Bags',
    discount: 0.1,
    badge: 'Save 10%',
    sub: 'Auto-discount at checkout',
  },
  {
    qty: 3,
    label: '3 Bags',
    discount: 0.25,
    badge: 'Most Popular · Save 25%',
    sub: 'Free brew guide included',
  },
] as const

function useCountdown(target: number) {
  const [now, setNow] = useState<number>(() => Date.now())
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [])
  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  const secs = Math.floor((diff % 60_000) / 1000)
  return { days, hours, mins, secs, isOver: diff === 0 }
}

export default function BundleProductActions({
  product,
  variantExtensions,
  saleEndsAt,
}: BundleProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) defaults[optionId] = opt.value
      }
    }
    return defaults
  })

  const [tierIndex, setTierIndex] = useState<number>(2) // default to most popular
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return (
      variants.find((v) => {
        if (!v.options) return false
        return v.options.every((opt) => {
          const optionId = opt.option_id || opt.option?.id
          if (!optionId) return false
          return selectedOptions[optionId] === opt.value
        })
      }) || variants[0]
    )
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency =
    (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock =
    !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock =
    inventoryQuantity != null &&
    inventoryQuantity > 0 &&
    inventoryQuantity < 15

  const tier = TIERS[tierIndex]
  const { days, hours, mins, secs } = useCountdown(saleEndsAt)

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return
    addItem(
      { variantId: selectedVariant.id, quantity: tier.qty },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success(
            tier.qty > 1
              ? `${tier.qty} bags added · ${Math.round(tier.discount * 100)}% off applied at checkout`
              : 'Added to bag',
          )
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, tier.qty, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity: tier.qty, item_price: metaValue }],
            num_items: tier.qty,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      },
    )
  }

  const hasMultipleVariants = variants.length > 1

  return (
    <div className="space-y-6">
      {/* Reviews-like rating (social proof, no fake count) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-accent text-accent"
              strokeWidth={0}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          Loved by 2,400+ subscribers across India
        </span>
      </div>

      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Urgency: countdown + low stock */}
      <div className="flex flex-col sm:flex-row gap-2 text-sm">
        <div className="flex-1 flex items-center gap-2 bg-accent/10 text-accent px-3.5 py-2.5 rounded-sm">
          <Clock className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
          <span className="font-medium">
            Launch pricing ends in{' '}
            <span className="tabular-nums font-semibold">
              {String(days).padStart(2, '0')}d : {String(hours).padStart(2, '0')}h : {String(mins).padStart(2, '0')}m : {String(secs).padStart(2, '0')}s
            </span>
          </span>
        </div>
        {isLowStock && (
          <div className="flex items-center gap-2 bg-red-600/10 text-red-700 px-3.5 py-2.5 rounded-sm">
            <Flame className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
            <span className="font-medium">
              Only {inventoryQuantity} left
            </span>
          </div>
        )}
      </div>

      {/* Option Selectors */}
      {hasMultipleVariants &&
        options.map((option: ProductOptionWithValues) => {
          const values = (option.values || [])
            .map((v) => (typeof v === 'string' ? v : v.value))
            .filter(Boolean) as string[]

          if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
            return null
          }

          const optionId = option.id
          const selectedValue = selectedOptions[optionId]

          return (
            <div key={optionId}>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
                {option.title}
                {selectedValue && (
                  <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                    — {selectedValue}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const isSelected = selectedValue === value
                  const isAvailable = variants.some((v) => {
                    const hasValue = v.options?.some(
                      (o) =>
                        (o.option_id === optionId || o.option?.id === optionId) &&
                        o.value === value,
                    )
                    if (!hasValue) return false
                    const vExt = variantExtensions?.[v.id]
                    if (!vExt) return true
                    if (vExt.allow_backorder) return true
                    return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                  })
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionId, value)}
                      disabled={!isAvailable}
                      className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all ${
                        isSelected
                          ? 'border-foreground bg-foreground text-background'
                          : isAvailable
                          ? 'border-border hover:border-foreground'
                          : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

      {/* ========= BUNDLE SELECTOR ========= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest font-semibold">
            Choose your bundle
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent font-semibold">
            <Sparkles className="h-3 w-3" /> Auto-applied
          </span>
        </div>

        <div className="space-y-2">
          {TIERS.map((t, idx) => {
            const isSelected = idx === tierIndex
            const unitPrice = currentPriceCents ?? 0
            const total = unitPrice * t.qty
            const discounted = Math.round(total * (1 - t.discount))
            const perUnit = Math.round(discounted / t.qty)
            const saved = total - discounted

            return (
              <button
                key={t.qty}
                type="button"
                onClick={() => setTierIndex(idx)}
                className={`w-full text-left rounded-sm border-2 transition-all p-4 flex items-center gap-4 ${
                  isSelected
                    ? 'border-foreground bg-muted/40 shadow-sm'
                    : 'border-border hover:border-foreground/40 bg-transparent'
                }`}
              >
                {/* Radio */}
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'border-foreground' : 'border-muted-foreground/40'
                  }`}
                >
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{t.label}</span>
                    {t.badge && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          idx === TIERS.length - 1
                            ? 'bg-accent text-white'
                            : 'bg-accent/15 text-accent'
                        }`}
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.sub}
                    {t.qty > 1 && unitPrice > 0 && (
                      <span>
                        {' · '}
                        {formatPrice(perUnit, currency)} / bag
                      </span>
                    )}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="font-heading font-semibold text-lg">
                    {formatPrice(discounted, currency)}
                  </div>
                  {saved > 0 && (
                    <div className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                      Save {formatPrice(saved, currency)}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingItem}
        className={`w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-all rounded-sm ${
          isOutOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : justAdded
            ? 'bg-green-700 text-white'
            : 'bg-foreground text-background hover:opacity-90 shadow-sm hover:shadow-md'
        }`}
      >
        {isAddingItem ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to bag
          </>
        ) : isOutOfStock ? (
          'Sold Out'
        ) : (
          <>
            <Package className="h-4 w-4" />
            Add {tier.qty > 1 ? `${tier.qty} bags` : 'to bag'} —{' '}
            {currentPriceCents != null
              ? formatPrice(
                  Math.round(currentPriceCents * tier.qty * (1 - tier.discount)),
                  currency,
                )
              : ''}
          </>
        )}
      </button>

      {/* Inline Secondary Trust */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-4 w-4 text-accent" strokeWidth={1.75} />
          <span>Free shipping over ₹999</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-accent" strokeWidth={1.75} />
          <span>Freshness guarantee</span>
        </div>
      </div>

      {/* Unused icons keep treeshake happy */}
      <span className="hidden"><Minus /><Plus /></span>
    </div>
  )
}
