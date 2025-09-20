import { useEffect, useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { StatisticsSection } from './components/sections/StatisticsSection';
import { SigGallery } from './components/ui/SigGallery';
import { SigCupSection } from './components/sections/SigCupSection';
// import { SigCupPoster } from './components/sections/SigCupPoster';
import { MobileMenu } from './components/layout/MobileMenu';
import GlobalToc from './components/layout/GlobalToc';
import { generateStatistics } from './utils/statistics';
import sigData from './data/sigs.json';
import './App.css';
import SigNetworkSection from './components/sections/SigNetworkSection';
import FederationIntroSection from './components/sections/FederationIntroSection.tsx';
import FederationHistorySection from './components/sections/FederationHistorySection.tsx';
import FederationPerformanceSection from './components/sections/FederationPerformanceSection.tsx';
import ChapterHeader from './components/sections/ChapterHeader.tsx';
// moved above with explicit extensions
// Slides removed per request

function App() {
  const [statistics, setStatistics] = useState<ReturnType<typeof generateStatistics> | null>(null);
  // poster mode disabled

  useEffect(() => {
    const stats = generateStatistics(sigData.sigs, sigData.categories);
    setStatistics(stats);
  }, []);

  // URL poster mode disabled

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 포스터 모드 비활성화

  // 일반 모드
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <MobileMenu onNavigate={handleNavigate} />
      <GlobalToc />

      <section id="home">
        <HeroSection />
      </section>
      <ChapterHeader id="chapter-federation" title="시그연합회" subtitle="소개 · 연혁 · 출범 후 성과" />
      <section id="federation">
        <FederationIntroSection />
      </section>
      <section id="federation-history">
        <FederationHistorySection />
      </section>
      <section id="federation-performance">
        <FederationPerformanceSection />
      </section>
      <ChapterHeader id="chapter-stats" title="시그현황" subtitle="시그 통계 · 시그 갤러리" />
      <section id="statistics">
        {statistics && <StatisticsSection statistics={statistics} />}
      </section>
      <section id="network">
        <SigNetworkSection />
      </section>
      <section id="gallery">
        <SigGallery sigs={sigData.sigs} categories={sigData.categories} />
      </section>
      <ChapterHeader id="chapter-cup" title="시그컵" />
      <section id="sigcup">
        <SigCupSection />
      </section>
      {/* 마지막 장: 피날레 */}
      <section id="closing" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-title mb-6">
            <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>감사합니다</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">함께 만드는 SIG, 함께 즐기는 SIG CUP. 11월 8일에 만나요!</p>
          <div className="relative h-56 sm:h-72 md:h-80 rounded-3xl overflow-hidden glass">
            <div className="absolute inset-0 grad-aurora opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-extrabold">11.08 SAT</div>
                <div className="text-white/85 mt-2">SIG CUP 2025 GRAND FINALE</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-10 px-4 bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-300 text-sm">
          <div className="mt-2">멘사코리아 시그연합회 | 시그 코디네이터 염동환 / 부시그 코디네이터 박현호, 박지용</div>
        </div>
      </footer>
    </div>
  );
}

export default App;