import { useEffect, useMemo, useRef, useState } from 'react'

interface SlideMeta {
  id: string
  title: string
}

interface PptSectionProps {
  src?: string
  initialToc?: SlideMeta[]
}

// PPT를 html로 서빙하고, 좌측에 TOC로 스크롤 이동 지원
export const PptSection: React.FC<PptSectionProps> = ({ src = '/index.html', initialToc }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [toc, setToc] = useState<SlideMeta[]>(initialToc || [])
  const [ready, setReady] = useState(false)

  // iframe 로드 후 내부에서 data-slide를 가진 섹션들을 TOC로 추출
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        const slideNodes = Array.from(doc.querySelectorAll('[data-slide], section[id]')) as HTMLElement[]
        const list: SlideMeta[] = slideNodes.map((el, idx) => {
          const id = el.getAttribute('id') || el.getAttribute('data-slide') || `slide-${idx + 1}`
          if (!el.id) el.id = id
          const title = el.getAttribute('data-title') || el.querySelector('h1,h2,h3')?.textContent || `슬라이드 ${idx + 1}`
          return { id, title }
        })
        if (list.length > 0) setToc(list)
        setReady(true)
      } catch {
        setReady(true)
      }
    }
    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [])

  const handleNavigate = (id: string) => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) return
      const el = doc.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      // cross-origin 또는 접근 불가
    }
  }

  const statusText = useMemo(() => ready ? '' : '로딩 중...' , [ready])

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-title">발표 자료</h2>
          <p className="text-gray-300 mt-2">좌측 목차를 이용해 슬라이드로 빠르게 이동하세요.</p>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <aside className="col-span-12 lg:col-span-3 glass rounded-2xl p-4 max-h-[70vh] overflow-auto custom-scroll">
            <div className="text-sm text-white/80 mb-2">목차</div>
            <ol className="space-y-1 text-sm">
              {toc.map((s, i) => (
                <li key={s.id}>
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-white/10 focus:bg-white/10"
                    onClick={() => handleNavigate(s.id)}
                  >
                    {i + 1}. {s.title}
                  </button>
                </li>
              ))}
              {toc.length === 0 && (
                <li className="text-white/60">자동 목차를 찾을 수 없습니다.</li>
              )}
            </ol>
          </aside>

          <main className="col-span-12 lg:col-span-9">
            <div className="aspect-4-3 glass rounded-2xl overflow-hidden">
              <iframe
                ref={iframeRef}
                src={src}
                title="PPT Viewer"
                className="w-full h-full border-0"
              />
            </div>
            {!ready && (
              <div className="mt-3 text-sm text-white/60">{statusText}</div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default PptSection


