import { motion } from 'framer-motion'

export const FederationHistorySection: React.FC = () => {
  const items = [
    { title: '출범', date: '5.17', desc: '시그연합회 공식 출범 및 운영 개시' },
    { title: '시그 규정 개정', date: '7.30', desc: '시그 운영 규정 정비 및 개정안 공표' },
    { title: '시그장 회의', date: '9.27 예정', desc: '정기 시그장 회의(안건: 운영/행사/협력안)' },
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
              style={{ "--underline-scale": 0 } as any}
            >
              시그연합회 연혁
            </motion.span>
            <br />
          </h2>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8">
            <ol className="relative border-l border-white/15 pl-6 space-y-6">
              {items.map((it, idx) => (
                <li key={idx} className="">
                  <div className="absolute -left-[9px] mt-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ring-2 ring-white/20" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6">
              <p className="text-white/70 text-sm">현재 시그 수</p>
              <p className="text-3xl font-bold">31</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-white/70 text-sm">현재 시그장 수</p>
              <p className="text-3xl font-bold">31</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-white/70 text-sm">주요 행사</p>
              <p className="text-3xl font-bold">시그장 회의</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FederationHistorySection


