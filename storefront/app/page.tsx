'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  Leaf,
  Coffee,
  Award,
  Mountain,
  Sparkles,
  MapPin,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMG =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80'
const LIFESTYLE_IMG =
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1600&q=80'
const BEANS_IMG =
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&q=80'
const POUR_IMG =
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1600&q=80'
const FARM_IMG =
  'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=1600&q=80'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* ========= HERO ========= */}
      <section className="relative overflow-hidden bg-[hsl(24_35%_14%)] text-[hsl(36_30%_97%)]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Freshly poured espresso with crema"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(24_35%_10%)]/95 via-[hsl(24_35%_10%)]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(24_35%_10%)]/50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container-custom min-h-[640px] lg:min-h-[720px] flex items-center py-20 lg:py-28">
          <div className="max-w-2xl space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.22em]">
                Sourced from Chikmagalur &amp; Araku Valley
              </span>
            </div>

            <h1 className="font-heading font-bold leading-[1.02] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-balance">
              Coffee the way it was{' '}
              <span className="italic font-normal text-[hsl(28_80%_72%)]">
                meant to be
              </span>
              .
            </h1>

            <p className="text-lg lg:text-xl text-white/80 max-w-xl leading-relaxed">
              Single-origin beans from the shade-grown estates of South India.
              Roasted in small batches and shipped within 48 hours — never sitting on a shelf.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[hsl(22_75%_52%)] hover:bg-[hsl(22_80%_46%)] text-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
                prefetch={true}
              >
                Shop Coffee
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white hover:bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-colors"
                prefetch={true}
              >
                Our Story
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[hsl(28_80%_72%)]" strokeWidth={1.75} />
                <span>Speciality Grade (84+)</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-[hsl(28_80%_72%)]" strokeWidth={1.75} />
                <span>Shade-grown &amp; ethically sourced</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[hsl(28_80%_72%)]" strokeWidth={1.75} />
                <span>Roasted to order</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= TICKER / MARQUEE ========= */}
      <section className="bg-[hsl(24_35%_14%)] border-y border-white/10 text-[hsl(36_30%_97%)] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-xs uppercase tracking-[0.28em]">
              <span className="inline-flex items-center gap-2"><Sparkles className="h-3 w-3" /> Fresh roasted daily</span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-2"><Mountain className="h-3 w-3" /> 100% Arabica</span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-2"><Leaf className="h-3 w-3" /> Farmer-direct</span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-2"><Truck className="h-3 w-3" /> Free shipping over ₹999</span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-2"><Award className="h-3 w-3" /> Speciality grade beans</span>
              <span className="opacity-40">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========= FEATURED PRODUCTS INTRO ========= */}
      <section className="py-section">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-14">
            <p className="text-xs uppercase tracking-[0.28em] text-accent font-medium">
              The Collection
            </p>
            <h2 className="text-h1 font-heading font-semibold text-balance">
              Two estates. Two distinct personalities.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every bag carries the soil, altitude, and craft of where it was grown.
              Pick your mood — or let us send both.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : collections && collections.length > 0 ? (
            collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                alternate={index % 2 === 1}
              />
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/products"
                className="group relative aspect-[4/5] overflow-hidden bg-muted"
              >
                <Image src={BEANS_IMG} alt="Dark roast" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] opacity-80 mb-2">Dark Roast</p>
                  <h3 className="text-3xl font-heading font-semibold">Chikmagalur Estate</h3>
                  <p className="mt-2 text-sm text-white/80">Dark chocolate · Hazelnut · Smoky finish</p>
                </div>
              </Link>
              <Link
                href="/products"
                className="group relative aspect-[4/5] overflow-hidden bg-muted"
              >
                <Image src={POUR_IMG} alt="Medium roast" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] opacity-80 mb-2">Medium Roast</p>
                  <h3 className="text-3xl font-heading font-semibold">Araku Valley</h3>
                  <p className="mt-2 text-sm text-white/80">Jasmine · Milk chocolate · Stone fruit</p>
                </div>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] link-underline pb-1"
              prefetch={true}
            >
              Shop All Coffee
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========= BEAN TO CUP — PROCESS ========= */}
      <section className="py-section bg-[hsl(24_35%_14%)] text-[hsl(36_30%_97%)]">
        <div className="container-custom">
          <div className="max-w-2xl space-y-4 mb-14">
            <p className="text-xs uppercase tracking-[0.28em] text-[hsl(28_80%_72%)] font-medium">
              Bean to Cup
            </p>
            <h2 className="text-h1 font-heading font-semibold text-balance">
              From the hills to your kitchen in 14 days.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {[
              {
                step: '01',
                title: 'Grown in the shade',
                desc: 'Hand-picked at 1,200–1,500m altitude on farms that pay 2× fair trade rates.',
                icon: Mountain,
              },
              {
                step: '02',
                title: 'Roasted to order',
                desc: 'We roast in small 8kg batches only after you order. Nothing sits on a shelf.',
                icon: Coffee,
              },
              {
                step: '03',
                title: 'At your door in 48h',
                desc: 'Shipped the day after roast, in a valve-sealed bag that keeps it fresh for weeks.',
                icon: Truck,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="space-y-4 border-t border-white/15 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(28_80%_72%)] font-mono">{step}</span>
                  <Icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-heading font-semibold">{title}</h3>
                <p className="text-white/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= EDITORIAL / STORY ========= */}
      <section className="py-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-3 relative aspect-[5/4] rounded-sm overflow-hidden bg-muted order-2 lg:order-1">
              <Image
                src={FARM_IMG}
                alt="Coffee farmer on an Indian plantation"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
              <p className="text-xs uppercase tracking-[0.28em] text-accent font-medium">
                Our Story
              </p>
              <h2 className="text-h1 font-heading font-semibold text-balance">
                India grows some of the world&apos;s best coffee. You&apos;ve probably never tasted it.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We started Kavi because the best Indian beans were being shipped abroad while
                locals drank stale instant. So we built direct relationships with smallholder farmers,
                brought the roasting in-house, and cut out every middleman who doesn&apos;t touch the bean.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The result: speciality-grade single origins at a price that makes sense, delivered
                so fresh the bag still smells like the roastery.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] link-underline pb-1"
                prefetch={true}
              >
                Read Full Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========= TRUST BAR ========= */}
      <section className="py-section-sm border-y bg-muted/40">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { icon: Truck, title: 'Free shipping', sub: 'On orders over ₹999' },
              { icon: Coffee, title: 'Roasted fresh', sub: 'Shipped within 48h' },
              { icon: Shield, title: 'Freshness guarantee', sub: 'Or your money back' },
              { icon: Leaf, title: 'Farmer-direct', sub: '2× fair trade pay' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3 justify-center md:justify-start">
                <Icon className="h-6 w-6 flex-shrink-0 text-accent" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= NEWSLETTER ========= */}
      <section className="relative py-section overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={LIFESTYLE_IMG}
            alt="Coffee beans roasting"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[hsl(24_35%_14%)]/90" />
        </div>
        <div className="relative container-custom max-w-xl text-center text-[hsl(36_30%_97%)]">
          <Sparkles className="h-7 w-7 mx-auto mb-4 text-[hsl(28_80%_72%)]" strokeWidth={1.5} />
          <h2 className="text-h1 font-heading font-semibold">Get 10% off your first bag.</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Join the Kavi list for brew guides, new single-origin drops, and early access to limited micro-lots.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 focus:border-white/60 backdrop-blur-sm rounded-sm px-4 py-3.5 text-sm placeholder:text-white/50 text-white focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-[hsl(22_75%_52%)] hover:bg-[hsl(22_80%_46%)] text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] transition-colors whitespace-nowrap rounded-sm"
            >
              Claim 10% Off
            </button>
          </form>
          <p className="mt-3 text-xs text-white/50">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  )
}
