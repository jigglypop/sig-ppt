import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNetworkStore } from '@/store/networkStore'
import SigStatisticsChart from '@/components/charts/SigStatisticsChart'

export const SigNetworkSection: React.FC = () => {
  const {
    networkData,
    isLoading,
    error,
    setAnalysisResult,
    setError,
    setLoading,
    getChartData,
  } = useNetworkStore()

  // Load data once
  useEffect(() => {
    if (networkData) return
    let aborted = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('./data/member.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('member.json 로드 실패')
        const data = await res.json()
        if (aborted) return
        // Keep only nodes with node_type field; links remain
        if (data && data.network && Array.isArray(data.network.nodes)) {
          data.network.nodes = data.network.nodes.filter((n: any) => n && n.node_type)
        }
        setAnalysisResult(data)
      } catch (e) {
        if (!aborted) setError(e instanceof Error ? e.message : 'JSON 로드 중 오류')
      } finally {
        if (!aborted) setLoading(false)
      }
    })()
    return () => { aborted = true }
  }, [networkData, setAnalysisResult, setError, setLoading])

  const chartData = getChartData()
  const adjustedChartData = React.useMemo(() => {
    if (!chartData) return null
    return {
      ...chartData,
      overallStats: { ...chartData.overallStats, totalSigs: 31 },
    }
  }, [chartData])
  const sigStats = chartData?.sigStats || []
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query) return sigStats
    const q = query.toLowerCase()
    return sigStats.filter(s => s.sigName.toLowerCase().includes(q))
  }, [sigStats, query])

  const mid = Math.ceil(filtered.length / 2)
  const page1 = filtered.slice(0, mid)
  const page2 = filtered.slice(mid)

  const listRef1 = useRef<HTMLDivElement>(null)
  const listRef2 = useRef<HTMLDivElement>(null)
  const focusFirst = useCallback(() => listRef1.current?.focus(), [])

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full grad-primary blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full grad-secondary blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 space-y-12">
            <div>
              <h2 className="relative text-3xl sm:text-4xl md:text-5xl">
                <span 
                  className="font-title text-underline-clean"
                  style={{ "--underline-scale": 1 } as any}
                >
                  그래프 요약
                </span>
                <br />
              </h2>
            </div>

            {/* Page 2: Charts */}
            <section id="net-charts" className="scroll-mt-24">
              <h3 className="text-3xl font-title mb-4">
                <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>그래프 요약</span>
              </h3>
              {adjustedChartData ? (
                <div className="space-y-8">
                  <SigStatisticsChart data={adjustedChartData.sigStats} />
                </div>
              ) : (
                <div className="text-gray-400">데이터가 없습니다. public/data/member.json을 확인하세요.</div>
              )}
            </section>

            {/* Page 3: List */}
            <section id="net-list" className="scroll-mt-24">
              <h3 className="text-3xl font-title mb-4">
                <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>시그 목록</span>
              </h3>
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="text-sm text-white/80">총 {filtered.length}개</div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') focusFirst() }}
                  placeholder="시그명 검색"
                  className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white outline-none focus:border-white/20"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 text-white/70 text-xs px-4 py-2 border-b border-white/10 bg-black/20">
                    <div className="col-span-7">시그명</div>
                    <div className="col-span-2 text-right">회원수</div>
                    <div className="col-span-3 text-right">중복률</div>
                  </div>
                  <div ref={listRef1} tabIndex={-1} className="max-h-[520px] custom-scroll overflow-auto">
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

                <div className="glass rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 text-white/70 text-xs px-4 py-2 border-b border-white/10 bg-black/20">
                    <div className="col-span-7">시그명</div>
                    <div className="col-span-2 text-right">회원수</div>
                    <div className="col-span-3 text-right">중복률</div>
                  </div>
                  <div ref={listRef2} className="max-h-[520px] custom-scroll overflow-auto">
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
              </div>
            </section>

            {error && !chartData && (
              <div className="mt-4 text-red-300">{error}</div>
            )}
          </main>
        </div>

        {isLoading && chartData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white font-medium">분석 중...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SigNetworkSection


