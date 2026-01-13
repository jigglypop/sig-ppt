import React, { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SigListData, SigListSigStat } from '../../types/sig'

type SigRow = {
  sigId: string
  sigName: string
  totalMembers: number
}

export const SigNetworkSection: React.FC = () => {
  const [sigData, setSigData] = useState<SigListData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load data once
  useEffect(() => {
    let aborted = false
    ;(async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('./data/sig_list.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('sig_list.json 로드 실패')
        const data = await res.json()
        if (aborted) return
        setSigData(data)
      } catch (e) {
        if (!aborted) setError(e instanceof Error ? e.message : 'JSON 로드 중 오류')
      } finally {
        if (!aborted) setIsLoading(false)
      }
    })()
    return () => { aborted = true }
  }, [])

  const sigStats = useMemo<SigRow[]>(
    () =>
      (sigData?.sigStats ?? []).map((s: SigListSigStat, idx: number) => ({
        sigId: String(idx),
        sigName: s.sigName,
        totalMembers: s.totalMembers,
      })),
    [sigData],
  )
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query) return sigStats
    const q = query.toLowerCase()
    return sigStats.filter((s) => s.sigName.toLowerCase().includes(q))
  }, [sigStats, query])

  const listRef = useRef<HTMLDivElement>(null)
  const focusFirst = useCallback(() => listRef.current?.focus(), [])

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full grad-primary blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full grad-secondary blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 space-y-12">
            {/* List */}
            <section id="net-list" className="scroll-mt-24">
              <h3 className="text-3xl font-title mb-4">
                <span className="text-underline-clean" style={{ "--underline-scale": 1 } as CSSProperties}>시그 목록</span>
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

              <div className="glass rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 text-white/70 text-xs px-4 py-2 border-b border-white/10 bg-black/20">
                  <div className="col-span-9">시그명</div>
                  <div className="col-span-3 text-right">회원수</div>
                </div>
                <div ref={listRef} tabIndex={-1} className="max-h-[520px] custom-scroll overflow-auto">
                  <div className="divide-y divide-white/10">
                    {filtered.map((sig) => (
                      <div key={sig.sigId} className="w-full px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-12 items-center">
                          <div className="col-span-9 truncate text-white">{sig.sigName}</div>
                          <div className="col-span-3 text-right text-white/90">{sig.totalMembers}명</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {error && !sigData && (
              <div className="mt-4 text-red-300">{error}</div>
            )}
          </main>
        </div>

        {isLoading && sigData && (
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


