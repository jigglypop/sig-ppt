import { motion } from 'framer-motion'

const Card: React.FC<{ title: string; children?: React.ReactNode; accent?: 'primary' | 'secondary' }>
  = ({ title, children, accent = 'primary' }) => (
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
              style={{ "--underline-scale": 0 } as any}
            >
              시그연합회 성과 보고
            </motion.span>
            <br />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="1) 시그 규정 제정">
            <p className="text-white/85 mt-2">시그 운영 기준을 수립·공표하여 운영 일관성과 투명성 확보 (7.30)</p>
          </Card>

          <Card title="2) 시그 증가">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              +4
            </div>
            <div className="text-white/70 mt-1">출범 이후 순증</div>
          </Card>

          <Card title="3) 시그 사이트 제작중">
            <ul className="mt-1 space-y-1 text-white/90 list-disc list-inside">
              <li>(1) 시그 홍보용 페이지: 오리엔테이션 홍보</li>
              <li>(2) 시그 공식 홈페이지: 사무국 협업. AWS 계정 생성 후 10월 릴리즈 목표</li>
            </ul>
          </Card>

          {/* 3) 현황 통계 제작 */}
          <Card title="4) 현황 통계 제작">
            <div className="text-white/90">사무국 협조로 데이터 수집·정제 및 시각화</div>
          </Card>

          {/* 4) 시그 소개 홍보 */}
          <Card title="5) 시그 소개 홍보">
            <div className="text-white/90">홍보위원회, 출판위원회 협업으로 대내외 홍보 진행</div>
          </Card>

          {/* 5) 시그컵 개최 */}
          <Card title="6) 시그컵 개최">
            <div className="text-white/90 mb-2">시그컵운영팀 18명 충원</div>
            <ul className="space-y-1 list-disc list-inside text-white/90">
              <li>(1) 사무국: 장소 협조, 사이트 운영 지원</li>
              <li>(2) 홍보위원회: 문해찬 위원장 협조. 인스타그램 홍보</li>
              <li>(3) SNS위원회: 최주은 위원장 시그컵 운영 협조(카스2) 및 송출 협조</li>
              <li>(4) 부띠끄위원회: 김채영 위원장 시그컵 부띠끄 제작 협조, 종목 운영 협조</li>
              <li>(5) 출판위원회: 이근백 위원장 회지 홍보 및 장세민 부위원장 취재 협조</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FederationPerformanceSection


