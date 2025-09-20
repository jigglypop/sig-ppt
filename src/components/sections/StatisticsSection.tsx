import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { CategoryChart } from '../ui/CategoryChart';
import type { Statistics } from '../../utils/statistics';

interface StatisticsSectionProps {
  statistics: Statistics;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ statistics }) => {
  // sig_list.json을 직접 사용 (member.json 미사용)
  const [sigData, setSigData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('./data/sig_list.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('sig_list.json 로드 실패');
        const data = await res.json();
        if (aborted) return;
        setSigData(data);
      } catch (e) {
        if (!aborted) setError(e instanceof Error ? e.message : '데이터 로드 중 오류');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true };
  }, []);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        src="/movie.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/sigcup.webp"
        aria-hidden="true"
      />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/50 to-black/70" />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/10 rounded-full"
            style={{
              left: `${(i * 97) % 100}%`,
              top: `${(i * 53) % 100}%`,
            }}
            animate={{
              y: [0, -24, 0],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 px-4"
        >
        <h1 className="relative text-3xl sm:text-4xl md:text-5xl">
            <motion.span 
              className="font-title text-underline-clean"
              initial={{ "--underline-scale": 0 }}
              animate={{ "--underline-scale": 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{ "--underline-scale": 0 } as any}
            >
              시그 현황
            </motion.span>
            <br />
          </h1>
        </motion.div>

        {/* 개요: sig_list.json 기반 정확 값 표시 */}
        {sigData && (
          <div className="mb-10">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-2xl font-title mb-4 text-white">
                <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>전체 통계</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sigData.overallStats.totalSigs}</div>
                  <div className="text-white/70 text-sm mt-1">전체 시그</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sigData.overallStats.totalUnique}</div>
                  <div className="text-white/70 text-sm mt-1">고유 회원</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sigData.overallStats.totalDuplicates}</div>
                  <div className="text-white/70 text-sm mt-1">중복 회원</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sigData.overallStats.averageDuplicationRate}%</div>
                  <div className="text-white/70 text-sm mt-1">평균 중복률</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sigData.overallStats.duplicateJoinRate}%</div>
                  <div className="text-white/70 text-sm mt-1">중복 가입률</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="glass rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-1">시그별 평균 회원 수</h4>
                  <p className="text-2xl font-bold text-cyan-400">{sigData.overallStats.averageMembersPerSig}명</p>
                  <p className="text-sm text-white/60 mt-1">시그당 평균 74~75명의 회원 보유</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-1">평균 중복 가입 수</h4>
                  <p className="text-2xl font-bold text-pink-400">{sigData.overallStats.averageDuplicationsPerDuplicate}개</p>
                  <p className="text-sm text-white/60 mt-1">중복 회원은 평균적으로 3개 이상의 시그에 가입</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 분포 */}
        <div className="mb-4 px-4">
          <h2 className="text-3xl font-title">
            <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>카테고리 분포</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryChart data={(sigData?.categories || []).map((c: any) => ({ category: c.name, name: c.name, count: c.percentage, icon: '' }))} />
          
          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
                  <h3 className="text-3xl font-title mb-4 text-white">
        <motion.span
          className="text-underline-clean"
          initial={{ "--underline-scale": 0 } as any}
          whileInView={{ "--underline-scale": 1 } as any}
          transition={{ duration: 0.9 }}
          style={{ "--underline-scale": 0 } as any}
        >
         인기 카테고리 TOP5
        </motion.span>
      </h3>
            <div className="space-y-4">
              {statistics.topCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${category.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{category.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
