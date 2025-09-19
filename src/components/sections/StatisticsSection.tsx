import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { CategoryChart } from '../ui/CategoryChart';
import type { Statistics } from '../../utils/statistics';
import { TrendingUp, Users, Award, Activity } from 'lucide-react';

interface StatisticsSectionProps {
  statistics: Statistics;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ statistics }) => {
  const statCards = [
    {
      icon: Users,
      label: '전체 시그',
      value: statistics.totalSigs,
      color: 'from-blue-500 to-blue-600',
      suffix: '개'
    },
    {
      icon: TrendingUp,
      label: '활동 멤버',
      value: statistics.totalMembers,
      color: 'from-purple-500 to-purple-600',
      suffix: '명+'
    },
    {
      icon: Award,
      label: '카테고리',
      value: statistics.categoryCounts.length,
      color: 'from-pink-500 to-pink-600',
      suffix: '개'
    },
    {
      icon: Activity,
      label: '평균 참여율',
      value: 87,
      color: 'from-green-500 to-green-600',
      suffix: '%'
    }
  ];

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

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-60 group-hover:opacity-95 transition-opacity rounded-2xl blur-lg" 
                style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
              <div className="relative glass rounded-2xl p-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryChart data={statistics.categoryCounts} />
          
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
