import { motion } from 'framer-motion';

export const SigCupPoster: React.FC = () => {
  const games = [
    { name: "리그 오브 레전드", image: "/poster/리그오브레전드.png" },
    { name: "마리오카트", image: "/poster/마리오카트.png" },
    { name: "카운터 스트라이크 2", image: "/poster/카운터스트라이크2.png" },
    { name: "철권8", image: "/poster/철권8.png" },
    { name: "카트라이더 러쉬플러스", image: "/poster/카트라이더러쉬플러스.png" },
    { name: "어몽어스", image: "/poster/어몽어스.png" },
    { name: "캐치마인드", image: "/poster/캐치마인드.png" },
    { name: "포커", image: "/poster/포커.png" },
    { name: "루미큐브", image: "/poster/루미큐브.png" },
    { name: "할리갈리", image: "/poster/할리갈리.png" },
    { name: "체스", image: "/poster/체스.png" },
    { name: "스플렌더", image: "/poster/스플렌더.png" },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="relative w-full max-w-4xl aspect-[3/4] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* 배경 효과 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at top left, rgba(139,92,246,0.15), transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(236,72,153,0.15), transparent 50%)
              `,
              filter: 'blur(80px)'
            }}
          />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="relative z-10 h-full flex flex-col p-8 sm:p-12">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-6xl sm:text-7xl font-title text-white mb-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              시그컵 2025
            </motion.h1>
            <motion.p 
              className="text-xl sm:text-2xl text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              공식 종목
            </motion.p>
          </div>

          {/* 게임 그리드 */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                className="relative group overflow-hidden rounded-lg shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={game.image || '/images/sigcup.webp'}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs sm:text-sm font-medium text-center">{game.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 푸터 */}
          <div className="mt-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-gray-400 text-sm">멘사코리아 시그연합회</p>
              <p className="text-gray-500 text-xs mt-1">2025.11</p>
            </motion.div>
          </div>
        </div>

        {/* 장식 요소 */}
        <div className="absolute top-8 right-8">
          <motion.div
            className="w-16 h-16 rounded-full grad-primary opacity-20 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        <div className="absolute bottom-8 left-8">
          <motion.div
            className="w-20 h-20 rounded-full grad-accent opacity-20 blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
};
