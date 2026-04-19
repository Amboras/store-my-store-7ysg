import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // ISR: revalidate every hour
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Leaf,
  Coffee,
  Award,
  Mountain,
  Lock,
  BadgeCheck,
  Sparkles,
} from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import BundleProductActions from '@/components/product/bundle-product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

// Products that receive the CRO-optimized bundle selector
const BUNDLE_ENABLED_HANDLES = new Set([
  'chikmagalur-dark-roast',
  'araku-valley-medium-roast',
])

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]

  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  const isBundleEnabled = BUNDLE_ENABLED_HANDLES.has(handle)
  // Sale ends 7 days from now (stable, computed at request time)
  const saleEndsAt = Date.now() + 7 * 24 * 60 * 60 * 1000

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Floating badge on main image */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-accent text-white px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-full shadow-sm">
                <Sparkles className="h-3 w-3" strokeWidth={2} />
                Roasted this week
              </div>
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: { url: string }, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Title & Subtitle */}
            <div>
              {product.subtitle && (
                <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {product.subtitle}
                </p>
              )}
              <h1 className="text-h2 lg:text-h1 font-heading font-semibold text-balance">
                {product.title}
              </h1>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* Variant Selector + Price + Bundle + Add to Cart (client component) */}
            {isBundleEnabled ? (
              <BundleProductActions
                product={product}
                variantExtensions={variantExtensions}
                saleEndsAt={saleEndsAt}
              />
            ) : (
              <ProductActions product={product} variantExtensions={variantExtensions} />
            )}

            {/* Expanded Trust Signals */}
            <div className="border-t pt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Freshness guarantee</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Or your money back — no questions asked.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ships in 48 hours</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Right after we roast it — never earlier.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Secure checkout</p>
                    <p className="text-xs text-muted-foreground mt-0.5">256-bit SSL · Stripe verified</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">30-day returns</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Don&apos;t love it? We&apos;ll make it right.</p>
                  </div>
                </div>
              </div>

              {/* Payment methods strip */}
              <div className="flex items-center gap-3 border-t pt-5">
                <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.75} />
                <p className="text-xs text-muted-foreground">
                  Secure checkout with Visa · Mastercard · UPI · Rupay · Net Banking
                </p>
              </div>
            </div>

            {/* Accordion Sections */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>

        {/* ========= WHY KAVI — below the fold ========= */}
        <section className="mt-20 lg:mt-28 border-t pt-16">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
            <p className="text-xs uppercase tracking-[0.28em] text-accent font-medium">Why Kavi</p>
            <h2 className="text-h2 font-heading font-semibold text-balance">
              What makes this bag different
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Mountain,
                title: 'High-altitude',
                desc: 'Grown at 1,200–1,500m where slower maturation means denser, more complex beans.',
              },
              {
                icon: Coffee,
                title: 'Small-batch roasted',
                desc: '8kg batches, never more. Every batch is tasted, dialled in, and signed off by our head roaster.',
              },
              {
                icon: Leaf,
                title: 'Shade-grown',
                desc: 'Cultivated under native canopy that supports biodiversity and creates a sweeter cup.',
              },
              {
                icon: Award,
                title: 'Speciality grade',
                desc: 'SCA cupping score 84+. Only the top 10% of the world&apos;s coffee qualifies.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
