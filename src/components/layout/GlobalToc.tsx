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
        { id: 'federation', label: '(1) 시그연합회 소개' },
        { id: 'federation-history', label: '(2) 연혁' },
        { id: 'federation-performance', label: '(3) 출범 후 성과' },
      ],
    },
    {
      title: '2. 시그현황',
      anchorId: 'chapter-stats',
      children: [
        { id: 'statistics', label: '(1) 시그 통계' },
        { id: 'gallery', label: '(2) 시그 갤러리' },
      ],
    },
    {
      title: '3. 시그컵',
      anchorId: 'chapter-cup',
      children: [
        { id: 'sigcup', label: '시그컵' },
      ],
    },
  ]), [])

  const [active, setActive] = useState<string>('chapter-federation')

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
  }

  const isGroupActive = (g: TocGroup) => active === g.anchorId || g.children.some(c => c.id === active)

  return (
    <nav className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-52">
      <div className="glass rounded-xl p-3 max-h-[70vh] overflow-auto custom-scroll">
        <div className="space-y-2 text-sm">
          {groups.map(group => (
            <div key={group.title}>
              <a
                href={`#${group.anchorId}`}
                onClick={(e) => { e.preventDefault(); go(group.anchorId) }}
                className={`block px-3 py-2 rounded font-semibold ${isGroupActive(group) ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'}`}
              >
                {group.title}
              </a>
              <ul className="mt-1 pl-1 space-y-0.5">
                {group.children.map(child => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      onClick={(e) => { e.preventDefault(); go(child.id) }}
                      className={`block px-3 py-1.5 rounded text-[13px] ${active===child.id ? 'bg-white/12 text-white' : 'text-white/80 hover:bg-white/8'}`}
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
    </nav>
  )
}

export default GlobalToc


