import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

type CardProps = {
  title: string
  children?: ReactNode
  accent?: 'primary' | 'secondary'
}

const Card = ({ title, children, accent = 'primary' }: CardProps) => (
  <div className={`relative rounded-2xl p-6 transition-colors glass hover:bg-white/5`}
    role="group"
  >
    <div className={`absolute inset-0 pointer-events-none rounded-2xl ${accent==='primary' ? 'grad-soft' : ''} opacity-30`} />
    <h1 className="text-white text-[20px] font-bold mb-3">{title}</h1>
    {children}
  </div>
)

export const FederationPerformanceSection: React.FC = () => {
  return (
    <section className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl">
            <motion.span 
              className="font-title text-underline-clean"
              initial={{ "--underline-scale": 0 }}
              whileInView={{ "--underline-scale": 1 }}
              transition={{ duration: 0.9 }}
              style={{ "--underline-scale": 0 } as CSSProperties}
            >
              시그연합회 성과 보고
            </motion.span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="1) 시그 규정 제정">
            <p className="text-white/85 mt-2">시그 운영 기준을 수립/공표하여 운영 일관성과 투명성 확보 (7.30)</p>
          </Card>

          <Card title="2) 시그 증가">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              +8
            </div>
            <div className="text-white/70 mt-1">출범 이후 순증 (31 → 39)</div>
          </Card>

          <Card title="3) 현황 통계 제작">
            <div className="text-white/90">사무국 협조로 데이터 수집/정제 및 시각화</div>
          </Card>

          <Card title="4) 시그 소개 홍보">
            <div className="text-white/90">홍보위원회, 출판위원회 협업으로 대내외 홍보 진행</div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FederationPerformanceSection


