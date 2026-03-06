export interface ImageAsset {
  src: string
  alt: string
  width: number
  height: number
}

export interface HeroContent {
  headline: string
  subheadline: string
  tagline: string
  price: string
  ctaPrimary: string
  ctaSecondary: string
  image: ImageAsset
}

export type FeatureIconId = 'camera' | 'chip' | 'battery' | 'titanium'

export interface FeatureCard {
  id: string
  icon: FeatureIconId
  title: string
  description: string
}

export interface ColorStoryContent {
  headline: string
  description: string
  images: ImageAsset[]
}

export interface PricingContent {
  headline: string
  price: string
  monthly: string
  benefits: string
  ctaPrimary: string
  ctaSecondary: string
}

export interface FooterLink {
  label: string
  href: string
}
