import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

export const FederationHistorySection: React.FC = () => {
  const items = [
    { title: '출범', date: '5.17', desc: '시그연합회 공식 출범 및 운영 개시' },
    { title: '시그 규정 개정', date: '7.30', desc: '시그 운영 규정 정비 및 개정안 공표' },
    { title: '시그장 회의', date: '', desc: '정기 시그장 회의(안건: 운영/행사/협력안)' },
  ]

  return (
    <section className="min-h-screen py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-24 right-1/4 w-[420px] h-[420px] rounded-full grad-secondary blur-3xl opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl">
            <motion.span 
              className="font-title text-underline-clean"
              initial={{ "--underline-scale": 0 }}
              whileInView={{ "--underline-scale": 1 }}
              transition={{ duration: 0.9 }}
              style={{ "--underline-scale": 0 } as CSSProperties}
            >
              시그연합회 연혁
            </motion.span>
          </h2>
        </div>

          <div className="space-y-6">
          <div className="glass rounded-3xl p-8">
            <ol className="border-l border-white/15 pl-4 space-y-6">
              {items.map((it, idx) => (
                <li key={idx} className="">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-white text-lg font-semibold">{idx+1}) {it.title}</p>
                    <p className="text-white/80">{it.date}</p>
                  </div>
                  {it.desc && (
                    <p className="text-white/80 mt-1">{it.desc}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="glass rounded-3xl p-8">
            <h3 className="text-2xl font-title mb-4 text-white">
              <span className="text-underline-clean" style={{ "--underline-scale": 1 } as CSSProperties}>시그 만드는 법</span>
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-white/90">
              <li>오프라인 모임 사진 작성</li>
              <li>온라인 카톡 개설 후 사진 캡쳐</li>
              <li>시그개설신청 게시판에 신청</li>
            </ol>
            <div className="mt-5">
              <a
                href="https://www.mensakorea.org/bbs/board.php?bo_table=sig_open"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-brand"
              >
                시그개설신청 게시판 바로가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FederationHistorySection


