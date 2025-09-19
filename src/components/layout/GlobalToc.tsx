import { useEffect, useMemo, useState } from 'react'

interface TocItem {
  id: string
  label: string
}

export const GlobalToc: React.FC = () => {
  // 루트 섹션 앵커 정의: App.tsx의 각 섹션 id와 라벨을 동기화
  const items: TocItem[] = useMemo(() => ([
    { id: 'home', label: '1. 소개' },
    { id: 'statistics', label: '2. 시그 현황' },
    { id: 'network', label: '3. 네트워크' },
    { id: 'gallery', label: '4. 시그 갤러리' },
    { id: 'sigcup', label: '5. 시그컵' },
  ]), [])

  const [active, setActive] = useState<string>('home')

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          if (id) setActive(id)
        }
      })
    }, { threshold: 0.5 })
    items.forEach(i => {
      const el = document.getElementById(i.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [items])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <ul className="space-y-2 text-sm">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); go(item.id) }}
              className={`block px-3 py-2 rounded ${active===item.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/90 hover:bg-white/15'}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default GlobalToc


