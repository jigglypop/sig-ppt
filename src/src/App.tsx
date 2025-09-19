import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// 간단 Fallback으로 대체
class ErrorBoundary extends React.Component<{ FallbackComponent: React.FC<{ error: Error, resetErrorBoundary: () => void }>, children: React.ReactNode }, { error: Error | null }> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch() { /* no-op */ }
  render() {
    const { FallbackComponent } = this.props
    if (this.state.error) {
      return <FallbackComponent error={this.state.error} resetErrorBoundary={() => this.setState({ error: null })} />
    }
    return <>{this.props.children}</>
  }
}

// Components
import SigStatisticsChart from '@/components/charts/SigStatisticsChart'
import OverallStatsPanel from '@/components/charts/OverallStatsPanel'
import StatsPanel from '@/components/StatsPanel'
// 간단 로딩/에러 컴포넌트 내장
const LoadingScreen: React.FC = () => (
  <div className="w-full h-screen flex items-center justify-center bg-slate-900">
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center text-white w-[28rem]">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl font-semibold">로딩 중...</div>
    </div>
  </div>
)

const ErrorFallback: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="w-full h-screen flex items-center justify-center bg-slate-900">
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center text-white w-[28rem]">
      <div className="text-4xl mb-3">!</div>
      <h2 className="text-2xl font-bold mb-2">앱 오류가 발생했습니다</h2>
      <p className="text-gray-300 mb-4">{error.message}</p>
      <button onClick={resetErrorBoundary} className="bg-white/20 rounded-md px-4 py-2 hover:bg-white/30">다시 시도</button>
    </div>
  </div>
)

// Hooks
import { useNetworkStore } from '@/store/networkStore'

const App: React.FC = () => {
  const {
    analysisResult,
    networkData,
    isLoading: storeLoading,
    error: storeError,
    setAnalysisResult,
    setError,
    setLoading,
    getChartData,
  } = useNetworkStore()

  const isLoading = storeLoading
  const error = storeError

  // 오류 재시도 핸들러
  const handleRetry = useCallback(() => {
    setError(null)
  }, [setError])

  // 앱 초기 로드시: public/data/member.json을 로드하여 스토어에 반영
  useEffect(() => {
    if (networkData) return
    (async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('./data/member.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('member.json 로드 실패')
        const data = await res.json()
        // 멤버 노드 제거: 네트워크 노드 중 'sig'만 유지
        if (data && data.network && Array.isArray(data.network.nodes)) {
          data.network.nodes = data.network.nodes.filter((n: any) => n && n.node_type === 'sig')
        }
        setAnalysisResult(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'JSON 로드 중 오류')
      } finally {
        setLoading(false)
      }
    })()
  }, [networkData, setAnalysisResult, setError, setLoading])

  // 로딩 상태 표시
  if (isLoading && !networkData) {
    return <LoadingScreen />
  }

  // 오류 상태 표시
  if (error && !networkData) {
    return (
      <ErrorFallback 
        error={new Error(error)} 
        resetErrorBoundary={handleRetry}
      />
    )
  }

  const chartData = getChartData()
  const sigStats = chartData?.sigStats || []
  const mid = Math.ceil(sigStats.length / 2)
  const page1 = sigStats.slice(0, mid)
  const page2 = sigStats.slice(mid)

  // 스크롤 스냅과 active 섹션 하이라이트
  const [activeId, setActiveId] = useState<string>('intro')
  const containerRef = useRef<HTMLDivElement>(null)
  const sections = useMemo(() => ['intro', 'overview', 'siglist-1', 'siglist-2'], [])
  const scrollLockRef = useRef(false)
  const lastScrollAtRef = useRef(0)
  const touchStartYRef = useRef(0)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const scrollToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, sections.length - 1))
    const id = sections[clamped]
    scrollToSection(id)
  }, [sections, scrollToSection])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          if (id) setActiveId(id)
        }
      })
    }, { root: null, threshold: 0.6 })

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  // 한 번의 휠/스와이프로 섹션 단위 이동
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (scrollLockRef.current) return
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollAtRef.current < 700) return
      lastScrollAtRef.current = now
      const dir = e.deltaY > 0 ? 1 : -1
      const currentIdx = Math.max(0, sections.indexOf(activeId))
      const nextIdx = Math.max(0, Math.min(currentIdx + dir, sections.length - 1))
      if (nextIdx !== currentIdx) {
        scrollLockRef.current = true
        scrollToIndex(nextIdx)
        setTimeout(() => { scrollLockRef.current = false }, 650)
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (scrollLockRef.current) return
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        const idx = Math.max(0, sections.indexOf(activeId))
        scrollLockRef.current = true
        scrollToIndex(idx + 1)
        setTimeout(() => { scrollLockRef.current = false }, 650)
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        const idx = Math.max(0, sections.indexOf(activeId))
        scrollLockRef.current = true
        scrollToIndex(idx - 1)
        setTimeout(() => { scrollLockRef.current = false }, 650)
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY || 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (scrollLockRef.current) return
      const y = e.touches[0]?.clientY || 0
      const dy = touchStartYRef.current - y
      if (Math.abs(dy) < 30) return
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollAtRef.current < 700) return
      lastScrollAtRef.current = now
      const dir = dy > 0 ? 1 : -1
      const idx = Math.max(0, sections.indexOf(activeId))
      scrollLockRef.current = true
      scrollToIndex(idx + dir)
      setTimeout(() => { scrollLockRef.current = false }, 650)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', onWheel, { passive: false })
      container.addEventListener('touchstart', onTouchStart, { passive: true })
      container.addEventListener('touchmove', onTouchMove, { passive: false })
    } else {
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: false })
    }
    window.addEventListener('keydown', onKey, { passive: false })

    return () => {
      if (container) {
        container.removeEventListener('wheel', onWheel as any)
        container.removeEventListener('touchstart', onTouchStart as any)
        container.removeEventListener('touchmove', onTouchMove as any)
      } else {
        window.removeEventListener('wheel', onWheel as any)
        window.removeEventListener('touchstart', onTouchStart as any)
        window.removeEventListener('touchmove', onTouchMove as any)
      }
      window.removeEventListener('keydown', onKey as any)
    }
  }, [activeId, sections, scrollToIndex])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div ref={containerRef} className="w-full min-h-screen relative snap-y snap-mandatory overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>

        {/* 사이드 목차 */}
        <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
          <ul className="space-y-2 text-sm">
            <li><a href="#intro" onClick={(e) => { e.preventDefault(); scrollToSection('intro') }} className={`block px-3 py-2 rounded text-white ${activeId==='intro' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>1. 소개</a></li>
            <li><a href="#overview" onClick={(e) => { e.preventDefault(); scrollToSection('overview') }} className={`block px-3 py-2 rounded text-white ${activeId==='overview' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>2. 현황</a></li>
            <li><a href="#siglist-1" onClick={(e) => { e.preventDefault(); scrollToSection('siglist-1') }} className={`block px-3 py-2 rounded text-white ${activeId==='siglist-1' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>3. 시그 목록 1</a></li>
            <li><a href="#siglist-2" onClick={(e) => { e.preventDefault(); scrollToSection('siglist-2') }} className={`block px-3 py-2 rounded text-white ${activeId==='siglist-2' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>4. 시그 목록 2</a></li>
          </ul>
        </nav>

        {/* 1) 시그연합회 소개 */}
        <section id="intro" className="min-h-screen snap-start flex items-center justify-center bg-slate-900 px-6">
          <div className="max-w-3xl text-center text-white">
            <h1 className="text-4xl font-extrabold mb-6">시그연합회 소개</h1>
            <div className="glass rounded-2xl p-6 space-y-3">
              <p className="text-lg">(1) 시그코디네이터 <span className="font-semibold">염동환</span></p>
              <p className="text-lg">(2) 부시그코디네이터 <span className="font-semibold">박지용</span>, <span className="font-semibold">박현호</span></p>
            </div>
          </div>
        </section>

        {/* 2) 시그 현황 */}
        <section id="overview" className="min-h-screen snap-start flex items-center bg-gradient-to-b from-slate-900 to-black">
          <main className="container mx-auto px-6 py-12 w-full">
            {analysisResult && <StatsPanel />}
            {chartData && (
              <div className="mt-6 space-y-6">
                <OverallStatsPanel data={chartData} />
                <SigStatisticsChart data={chartData.sigStats} />
              </div>
            )}
            {!chartData && (
              <div className="text-white/80">데이터가 없습니다. public/data/member.json을 확인하세요.</div>
            )}
          </main>
        </section>

        {/* 3) 전체 시그 목록 - 페이지 1 */}
        <section id="siglist-1" className="min-h-screen snap-start bg-slate-900 py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-4">전체 시그 목록 (상)</h2>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/30 border-b border-white/10 px-6 py-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/60 mt-1">총 {sigStats.length}개</p>
                  </div>
                </div>
              </div>
              <div className="custom-scroll">
                <div className="grid grid-cols-12 text-white/80 text-xs px-4 py-2 border-b border-white/10 bg-black/20">
                  <div className="col-span-7">시그명</div>
                  <div className="col-span-2 text-right">회원수</div>
                  <div className="col-span-3 text-right">중복률</div>
                </div>
                <div className="divide-y divide-white/10">
                  {page1.map((sig) => (
                    <div key={sig.sigId} className="w-full px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-12 items-center">
                        <div className="col-span-7 truncate text-white">{sig.sigName}</div>
                        <div className="col-span-2 text-right text-white/90">{sig.totalMembers}명</div>
                        <div className="col-span-3 text-right">
                          <span className={`px-2 py-1 rounded text-[10px] ${
                            sig.duplicationRate > 30 ? 'bg-red-500/20 text-red-300' :
                            sig.duplicationRate > 15 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {sig.duplicationRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4) 전체 시그 목록 - 페이지 2 */}
        <section id="siglist-2" className="min-h-screen snap-start bg-slate-900 py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-4">전체 시그 목록 (하)</h2>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 text-white/80 text-xs px-4 py-2 border-b border-white/10 bg-black/20">
                <div className="col-span-7">시그명</div>
                <div className="col-span-2 text-right">회원수</div>
                <div className="col-span-3 text-right">중복률</div>
              </div>
              <div className="divide-y divide-white/10">
                {page2.map((sig) => (
                  <div key={sig.sigId} className="w-full px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-12 items-center">
                      <div className="col-span-7 truncate text-white">{sig.sigName}</div>
                      <div className="col-span-2 text-right text-white/90">{sig.totalMembers}명</div>
                      <div className="col-span-3 text-right">
                        <span className={`px-2 py-1 rounded text-[10px] ${
                          sig.duplicationRate > 30 ? 'bg-red-500/20 text-red-300' :
                          sig.duplicationRate > 15 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {sig.duplicationRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 로딩 오버레이 */}
        {isLoading && chartData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white font-medium">분석 중...</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  )
}

export default App
