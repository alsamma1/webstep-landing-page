import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getHomepageData } from '@/lib/homepage-server'
import type { HomepageData } from '@/lib/homepage-types'

// Sections
import HeroExperience from '@/components/sections/HeroExperience'
import ServicesExperience from '@/components/sections/ServicesExperience'
import StorySection from '@/components/sections/StorySection'
import ProcessExperience from '@/components/sections/ProcessExperience'
import PortfolioExperience from '@/components/sections/PortfolioExperience'
import StatsFeatures from '@/components/sections/StatsFeatures'
import ServicesNav from '@/components/sections/ServicesNav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getVisibilityClass(visibility?: { desktop: boolean; tablet: boolean; mobile: boolean }) {
  if (!visibility) return ''
  const { desktop, tablet, mobile } = visibility

  // All visible
  if (desktop && tablet && mobile) return ''
  // All hidden
  if (!desktop && !tablet && !mobile) return 'hidden'

  // Specific device visibility mappings using Tailwind:
  // Mobile only
  if (mobile && !tablet && !desktop) return 'block md:hidden'
  // Tablet only
  if (!mobile && tablet && !desktop) return 'hidden md:block lg:hidden'
  // Desktop only
  if (!mobile && !tablet && desktop) return 'hidden lg:block'
  // Mobile + Tablet (hide on Desktop)
  if (mobile && tablet && !desktop) return 'block lg:hidden'
  // Tablet + Desktop (hide on Mobile)
  if (!mobile && tablet && desktop) return 'hidden md:block'
  // Mobile + Desktop (hide on Tablet)
  if (mobile && !tablet && desktop) return 'block md:hidden lg:block'

  return ''
}

function renderSection(id: string, data: HomepageData) {
  switch (id) {
    case 'hero':
      return <HeroExperience data={data.hero} yemenData={data.yemenHero} />
    case 'services_experience':
      return <ServicesExperience data={data.servicesExperience} />
    case 'story':
      return <StorySection data={data.story} />
    case 'process':
      return <ProcessExperience data={data.process} />
    case 'services_nav':
      return <ServicesNav data={data.servicesNav} />
    case 'stats_features':
      return <StatsFeatures data={data.statsFeatures} />
    case 'portfolio':
      return <PortfolioExperience data={data.portfolio} />
    default:
      return null
  }
}

export default async function HomePage() {
  const homepageData = await getHomepageData()

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {homepageData.sectionOrder.map((sectionId) => {
          const meta = homepageData.sectionsMeta?.[sectionId]
          if (meta && meta.enabled === false) return null

          const visibilityClass = getVisibilityClass(meta?.visibility)

          return (
            <div
              key={sectionId}
              id={`sec-wrapper-${sectionId}`}
              className={visibilityClass}
              data-section-id={sectionId}
            >
              {renderSection(sectionId, homepageData)}
            </div>
          )
        })}
      </main>
      <Footer />
    </>
  )
}
