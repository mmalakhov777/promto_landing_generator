import { Header } from '@/components/sections/header';
import { Hero } from '@/components/sections/hero';
import { WhatIsPromto } from '@/components/sections/what-is-promto';
import { WhatCanDo } from '@/components/sections/what-can-do';
import { FourSteps } from '@/components/sections/four-steps';
import { Advantages } from '@/components/sections/advantages';
import { Pricing } from '@/components/sections/pricing';
import { FAQ } from '@/components/sections/faq';
import { Footer } from '@/components/sections/footer';
import { BackgroundBlobs } from '@/components/ui/background-blobs';
import { FadeIn } from '@/components/ui/fade-in';

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <BackgroundBlobs />
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="relative z-10">
        <FadeIn>
          <Hero />
        </FadeIn>
        <FadeIn>
          <WhatIsPromto />
        </FadeIn>
        <FadeIn>
          <WhatCanDo />
        </FadeIn>
        <FadeIn>
          <FourSteps />
        </FadeIn>
        <FadeIn>
          <Advantages />
        </FadeIn>
        <FadeIn>
          <Pricing />
        </FadeIn>
        <FadeIn>
          <FAQ />
        </FadeIn>
      </main>
      <FadeIn>
        <Footer />
      </FadeIn>
    </div>
  );
}
