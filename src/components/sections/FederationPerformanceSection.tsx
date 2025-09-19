import { motion } from 'framer-motion'

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="pl-2 list-disc list-inside text-white/90">{children}</li>
)

const SubBullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="pl-6 list-[circle] text-white/80">{children}</li>
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

        <div className="glass rounded-3xl p-8 space-y-8">
          <ol className="space-y-5 text-lg">
            <li>
              <div className="text-white font-semibold">1) 시그 증가 + 4</div>
            </li>
            <li>
              <div className="text-white font-semibold">2) 시그 사이트 제작중</div>
              <ul className="mt-2 space-y-1">
                <SubBullet>(1) 시그 홍보용 페이지: 오리엔테이션 홍보</SubBullet>
                <SubBullet>(2) 시그 공식 홈페이지: 사무국 협업. AWS 계정 생성 후 10월 릴리즈 목표</SubBullet>
              </ul>
            </li>
            <li>
              <div className="text-white font-semibold">3) 현황 통계 제작: 사무국 협조</div>
            </li>
            <li>
              <div className="text-white font-semibold">4) 시그 소개 홍보: 홍보위원회, 출판위원회 협업</div>
            </li>
            <li>
              <div className="text-white font-semibold">5) 시그컵 개최: 시그컵운영팀 18명 충원</div>
              <ul className="mt-2 space-y-1">
                <SubBullet>(1) 홍보위원회: 문해찬 위원장 협조. 인스타그램 홍보</SubBullet>
                <SubBullet>(2) SNS위원회: 최주은 위원장 시그컵 운영 협조(카스2) 및 송출 협조</SubBullet>
                <SubBullet>(3) 부띠끄위원회: 김채영 위원장 시그컵 부띠끄 제작 협조, 종목 운영 협조</SubBullet>
                <SubBullet>(4) 출판위원회: 이근백 위원장 회지 홍보 및 장세민 부위원장 취재 협조</SubBullet>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}

export default FederationPerformanceSection


