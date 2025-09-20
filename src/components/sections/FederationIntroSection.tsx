import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LeaderCardProps {
  name: string
  lines: ReactNode[]
}

const LeaderCard: React.FC<LeaderCardProps> = ({ name, lines }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 grad-soft opacity-40 group-hover:opacity-60 transition-opacity rounded-3xl" />
      <div className="relative glass rounded-3xl overflow-hidden p-8">
        <h4 className="text-3xl md:text-4xl font-title mb-4">
          <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>{name}</span>
        </h4>
        <div className="space-y-2 text-lg">
          {lines.map((node, i) => (
            <p key={i} className="text-white/90">{node}</p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export const FederationIntroSection: React.FC = () => {
  return (
    <section className="min-h-screen py-20 pb-28 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/3 w-[420px] h-[420px] rounded-full grad-aurora blur-3xl opacity-40" />
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
              시그연합회 소개
            </motion.span>
            <br />
          </h2>
        </div>

        {/* 연합회 비전/협업 안내 */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">왜 시그연합회인가</h3>
              <ul className="list-disc list-inside text-white/90 space-y-1">
                <li>모든 분야가 다 있는 멘사 내의 포텐셜</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">협업 요청</h3>
              <p className="text-white/85">연합회/위원회/시그 간 적극적인 협업 신청을 환영합니다. 함께 시너지를 만들어 보세요.</p>
            </div>
          </div>
        </div>

        {/* 1행: 코디네이터 단독, 2행: 부코디네이터 2명 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="md:col-span-2">
            <LeaderCard
              name="염동환"
              lines={[
                '시그코디네이터',
                '모개숲 시그장',
                'NH농협은행 IT기획부 IT신기술융합팀 근무',
              ]}
            />
          </div>

          <LeaderCard
            name="박지용"
            lines={[
              '부시그코디네이터',
              '시그니쳐 시그장',
              'aik 경영지원이사',
            ]}
          />
          <LeaderCard
            name="박현호"
            lines={[
              '부시그코디네이터',
              (<span key="strike" className="line-through">냥시그냥 (시그장)</span>),
              '(시그장 오레오님의 집사)',
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export default FederationIntroSection


