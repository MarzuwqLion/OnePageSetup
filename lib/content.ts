import type {
  HeroContent,
  FeatureCard,
  ColorStoryContent,
  PricingContent,
  FooterLink,
} from './types'

export const heroContent: HeroContent = {
  headline: 'iPhone 17 Pro Max',
  subheadline: 'Cosmic Orange',
  tagline: 'Titanium. Redefined.',
  price: 'From $1,199',
  ctaPrimary: 'Buy Now',
  ctaSecondary: 'Learn More',
  image: {
    src: 'https://v3b.fal.media/files/b/0a9102b4/3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png',
    alt: 'iPhone 17 Pro Max in Cosmic Orange — front and back view showing titanium finish',
    width: 800,
    height: 800,
  },
}

export const featuresContent: FeatureCard[] = [
  {
    id: 'camera',
    icon: 'camera',
    title: '48MP Fusion Camera',
    description: 'See every detail with stunning clarity.',
  },
  {
    id: 'chip',
    icon: 'chip',
    title: 'A19 Pro Chip',
    description: 'Desktop-class performance in your pocket.',
  },
  {
    id: 'battery',
    icon: 'battery',
    title: 'All-Day Battery',
    description: '29-hour battery life. Always ready.',
  },
  {
    id: 'titanium',
    icon: 'titanium',
    title: 'Titanium Design',
    description: 'Aerospace-grade strength, featherlight feel.',
  },
]

export const colorStoryContent: ColorStoryContent = {
  headline: 'Cosmic Orange',
  description:
    'A color born from the warmth of a desert sunset. The titanium frame catches light differently at every angle — warm, vivid, unmistakably alive.',
  images: [
    {
      src: 'https://v3b.fal.media/files/b/0a9102b4/3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png',
      alt: 'iPhone 17 Pro Max Cosmic Orange — front and back',
      width: 800,
      height: 800,
    },
    {
      src: 'https://v3b.fal.media/files/b/0a9102b5/GaPe8yDttbW7uYFKDhvsG_LwovZYGG.png',
      alt: 'iPhone 17 Pro — Deep Blue, Cosmic Orange, and Silver color lineup',
      width: 800,
      height: 800,
    },
    {
      src: 'https://v3b.fal.media/files/b/0a9102b6/NpnKgVLEDXvK9KMSfm8fF_2x6y4ZVa.png',
      alt: 'iPhone 17 Pro camera system close-up in Cosmic Orange',
      width: 800,
      height: 800,
    },
  ],
}

export const pricingContent: PricingContent = {
  headline: 'iPhone 17 Pro Max',
  price: 'From $1,199',
  monthly: 'Starting at $49.91/mo. for 24 months.',
  benefits: 'Free shipping. Free returns. 1-year warranty.',
  ctaPrimary: 'Buy Now',
  ctaSecondary: 'Learn More',
}

export const footerLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'Accessibility', href: '#' },
]
