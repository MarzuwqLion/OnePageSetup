import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import ColorStorySection from '@/components/ColorStorySection'
import PricingCTASection from '@/components/PricingCTASection'
import Footer from '@/components/Footer'
import StickyMobileCTA from '@/components/StickyMobileCTA'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen font-sans text-[#1D1D1F]">
        <HeroSection />
        <FeaturesSection />
        <ColorStorySection />
        <PricingCTASection />
        <Footer />
      </main>
      <StickyMobileCTA />
    </>
  )
}
