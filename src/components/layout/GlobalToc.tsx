import { useEffect, useMemo, useState } from 'react'

interface TocChild { id: string; label: string }
interface TocGroup { title: string; anchorId: string; children: TocChild[] }

export const GlobalToc: React.FC = () => {
  // 첫 대문(Hero) 이후부터 노출, 장 타이틀 자체도 클릭 가능
  const groups: TocGroup[] = useMemo(() => ([
    {
      title: '1. 시그연합회',
      anchorId: 'chapter-federation',
      children: [
        { id: 'federation', label: '시그연합회 소개' },
        { id: 'federation-history', label: '연혁' },
        { id: 'federation-performance', label: '출범 후 성과' },
      ],
    },
    {
      title: '2. 시그현황',
      anchorId: 'chapter-stats',
      children: [
        { id: 'statistics', label: '시그 통계' },
        { id: 'gallery', label: '시그 갤러리' },
      ],
    },
  ]), [])

  const [active, setActive] = useState<string>('chapter-federation')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const ids = groups.flatMap(g => [g.anchorId, ...g.children.map(c => c.id)])
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          if (id) setActive(id)
        }
      })
    }, { threshold: 0.5 })
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [groups])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsOpen(false)
  }

  const isGroupActive = (g: TocGroup) => active === g.anchorId || g.children.some(c => c.id === active)

  return (
    <nav className="hidden md:block fixed left-2 top-1/2 -translate-y-1/2 z-40">
      <div
        className={[
          'glass rounded-xl border border-white/10 overflow-hidden',
          'transition-[width] duration-200 ease-out',
          isOpen ? 'w-56' : 'w-11',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-2 p-2 border-b border-white/10 bg-black/20">
          <button
            type="button"
            onClick={() => setIsOpen(v => !v)}
            aria-label={isOpen ? '목차 닫기' : '목차 열기'}
            aria-expanded={isOpen}
            className="btn btn-ghost p-2 rounded-lg"
          >
            <span className="text-sm font-semibold">{isOpen ? '×' : '≡'}</span>
          </button>
          {isOpen && <div className="text-xs text-white/70 pr-1">목차</div>}
        </div>

        {isOpen && (
          <div className="p-2.5 max-h-[70vh] overflow-auto custom-scroll">
            <div className="space-y-2 text-sm">
              {groups.map((group) => (
                <div key={group.title}>
                  <a
                    href={`#${group.anchorId}`}
                    title={group.title}
                    onClick={(e) => { e.preventDefault(); go(group.anchorId) }}
                    className={[
                      'block w-full px-3 py-2 rounded-lg font-semibold',
                      'whitespace-nowrap truncate',
                      isGroupActive(group) ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10',
                    ].join(' ')}
                  >
                    {group.title}
                  </a>
                  <ul className="mt-1 pl-1 space-y-1">
                    {group.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          title={child.label}
                          onClick={(e) => { e.preventDefault(); go(child.id) }}
                          className={[
                            'block w-full px-3 py-2 rounded-lg text-[13px]',
                            'whitespace-nowrap truncate',
                            active === child.id ? 'bg-white/12 text-white' : 'text-white/80 hover:bg-white/8',
                          ].join(' ')}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default GlobalToc


