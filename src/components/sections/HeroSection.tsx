import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {/* Aurora Background */}
        <div className="absolute inset-0 grad-aurora opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="#9C92AC" fillOpacity="0.05" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute top-20 left-20 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute bottom-20 right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-2xl"
        />
      </div>
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo/Title Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative inline-block"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-40"
            />
            <h1 className="relative text-5xl sm:text-7xl md:text-9xl">
              <motion.span 
                className="font-title text-underline-clean"
                initial={{ "--underline-scale": 0 }}
                animate={{ "--underline-scale": 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                style={{ "--underline-scale": 0 } as any}
              >
                멘사코리아
              </motion.span>
              <br />
            </h1>

            <h1 className="relative text-5xl sm:text-7xl md:text-9xl">
              <motion.span 
                className="font-title text-underline-clean"
                initial={{ "--underline-scale": 0 }}
                animate={{ "--underline-scale": 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                style={{ "--underline-scale": 0 } as any}
              >
                시그소개
              </motion.span>
              <br />
            </h1>
          </motion.div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.mensakorea.org/bbs/board.php?bo_table=sig"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost px-6 py-3 rounded-full text-md transition"
            >
              멘사 공식 SIG 페이지 바로가기
            </a>
          </div>


          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16"
          >
            {[
              { number: "31+", label: "활동 시그" },
              { number: "983+", label: "활동 멤버" },
              { number: "15+", label: "카테고리" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
