import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';

export const SigCupSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const features = [
    {
      icon: Trophy,
      title: "시그 대항전",
      description: "각 시그의 특색을 살린 다양한 대회와 이벤트"
    },
    {
      icon: Calendar,
      title: "게임 활동",
      description: "실력을 뽐낼 수 있는 멘사 시그들의 장"
    },
    {
      icon: Users,
      title: "네트워킹",
      description: "다른 시그 멤버들과의 교류 기회"
    }
  ];

  const highlights = [
    { number: "15+", label: "참가 시그" },
    { number: "300+", label: "참가자" },
    { number: "10+", label: "경쟁 종목" },
    { number: "1", label: "우수시그" }
  ];

  const schedule = [
    { title: "온라인 예선", period: "10월 15일 ~ 11월 3일" },
    { title: "오프라인 결승", period: "11월 둘째 주 토요일, 전일 진행" },
  ];

  const onlineGames = [
    { name: "리그 오브 레전드", category: "전략", description: "메인 전략 종목, 5vs5 팀전", image: "/poster/리그오브레전드.png" },
    { name: "마리오카트", category: "레이싱", description: "콘솔/모바일 기반, 높은 접근성", image: "/poster/마리오카트.png" },
    { name: "카운터 스트라이크 2", category: "FPS", description: "5인팀 전술 슈팅", image: "/poster/카운터스트라이크2.png"
      
     },
    { name: "철권8", category: "격투", description: "1vs1 격투, 무대 결승 최적화", image: "/poster/철권8.png" },
    { name: "카트라이더 러쉬플러스", category: "모바일", description: "모바일 레이싱, 이벤트전", image: "/poster/카트라이더러쉬플러스.png" },
    { name: "어몽어스", category: "파티", description: "온라인 결승 후 하이라이트 중계", image: "/poster/어몽어스.png" },
    { name: "캐치마인드", category: "캐주얼", description: "그림 추리 게임, 라이트 종목", image: "/poster/캐치마인드.png" },
  ];

  const boardGames = [
    { name: "포커", category: "카드", description: "텍사스 홀덤 방식", image: "/poster/포커.png" },
    { name: "루미큐브", category: "타일", description: "숫자 조합 전략 게임", image: "/poster/루미큐브.png" },
    { name: "할리갈리", category: "반응", description: "빠른 반응속도 게임", image: "/poster/할리갈리.png" },
    { name: "체스", category: "전략", description: "클래식 보드게임의 정수", image: "/poster/체스.png" },
    { name: "스플렌더", category: "엔진빌딩", description: "자원 관리 전략 게임", image: "/poster/스플렌더.png" },
  ];

  const getTagClass = (category: string) => {
    return category === '전략' ? 'academic' : category === 'FPS' ? 'game' : category === '격투' ? 'social' : category === '카드' ? 'game' : 'hobby';
  };

  const GameCard = ({ game, variant = 'standard' }: { game: { name: string; category: string; description?: string; image?: string }; variant?: 'poster' | 'standard' | 'frame' }) => {
    if (variant === 'frame') {
      return (
        <motion.div
          key={game.name}
          className="group relative w-full min-w-0 overflow-hidden shadow-2xl shadow-black/50"
          whileHover={{ scale: 1.01 }}
          aria-label={`${game.name} 액자 카드`}
        >
          <div className="relative w-full" style={{ paddingTop: '150%' }}>{/* 2:3 portrait */}
            <img
              src={game.image || '/images/sigcup.webp'}
              alt={`${game.name} 포스터`}
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="bg-black/55 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 border-t border-white/10">
                <h4 className="text-white text-base sm:text-lg font-semibold drop-shadow">{game.name}</h4>
                {game.description && (
                  <p className="text-gray-200 text-xs sm:text-sm mt-1 line-clamp-2">{game.description}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    if (variant === 'poster' && game.image) {
      return (
        <motion.div
          key={game.name}
          className="group relative rounded-3xl overflow-hidden p-[2px] grad-primary neon-soft"
          whileHover={{ scale: 1.02 }}
          aria-label={`${game.name} 포스터 카드`}
        >
          <div className="relative bg-black rounded-[22px] overflow-hidden">
            <img
              src={game.image}
              alt={`${game.name} 포스터`}
              className="w-full max-h-[640px] md:max-h-[720px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <span className={`tag tag-${getTagClass(game.category)}`}>{game.category}</span>
            </div>
            <a
              href={game.image}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost absolute top-3 right-3 px-3 py-1 text-xs"
            >
              원본 보기
            </a>
          </div>
          <div className="p-4">
            <h4 className="text-white text-lg font-semibold">{game.name}</h4>
            {game.description && (
              <p className="text-gray-400 text-sm mt-1">{game.description}</p>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        key={game.name}
        className="group relative rounded-2xl overflow-hidden"
        whileHover={{ scale: 1.02 }}
        aria-label={`${game.name} 카드`}
      >
        <div className="absolute inset-0 grad-soft opacity-30" />
        <img
          src={game.image || '/images/sigcup.webp'}
          alt={`${game.name} 포스터`}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`tag tag-${getTagClass(game.category)}`}>{game.category}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white text-lg font-semibold">{game.name}</h4>
          {game.description && (
            <p className="text-gray-300 text-sm mt-1">{game.description}</p>
          )}
        </div>
        <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl" />
      </motion.div>
    );
  };

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-black">
      <div className="absolute inset-0">
        {/* Aurora Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20" />
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at top left, rgba(99,102,241,0.08), transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(236,72,153,0.08), transparent 50%)
            `,
            filter: 'blur(100px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
       
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 73) % 100}%`,
            }}
            animate={{
              y: [0, -600],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: (i % 5) + 10,
              repeat: Infinity,
              delay: (i % 7) * 0.3,
              ease: "linear",
            }}
          />
        ))}
        <motion.div
          className="pointer-events-none absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/30 rounded-full blur-2xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/30 rounded-full blur-2xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 max-w-7xl mx-auto px-4"
      >
        {/* Hero Section */}
        <motion.div
          style={{ scale }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 grad-primary rounded-full blur-xl opacity-60"
              />
              <div className="relative w-40 h-40 md:w-48 md:h-48 glass rounded-full flex items-center justify-center">
                <Trophy className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </motion.div>

          <h1 className="relative text-5xl sm:text-7xl md:text-9xl">
            <motion.span 
              className="font-title text-underline-clean"
              initial={{ "--underline-scale": 0 }}
              animate={{ "--underline-scale": 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{ "--underline-scale": 0 } as any}
            >
              시그컵 2025
            </motion.span>
            <br />
          </h1>
          
          <div className="relative overflow-hidden rounded-2xl neon-soft max-w-4xl mx-auto m-10">
            <video
              src="/movie.mp4"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/sigcup.webp"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h4 className="text-white text-xl sm:text-2xl font-title">SIG CUP 하이라이트</h4>
            </div>
          </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.notion.so/2025-24e1264dbfae808290e9ee10748a0021"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brand px-6 py-3 rounded-full text-ms transition"
            >
              노션 안내 페이지
            </a>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative glass rounded-2xl p-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex p-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 mb-6"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-light rounded-3xl p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {highlights.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-title text-white mb-4">일정</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {schedule.map((s) => (
              <div key={s.title} className="glass rounded-xl p-5">
                <p className="text-sm text-gray-400">{s.title}</p>
                <p className="text-white text-lg mt-1">{s.period}</p>
              </div>
            ))}
          </div>
          
        </motion.div>
        <div className="relative justify-center text-center mt-50 m-10">
          <h3 className="text-8xl font-title mb-4 text-white">
            시그컵 2025
          </h3>
        </div>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 mx-4 sm:mx-8 md:mx-20 lg:mx-40"
        >
          <div className="relative mb-12">
            <div className="absolute inset-0 -m-8 glass-dark rounded-3xl opacity-30" />
            <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {[...onlineGames, ...boardGames].map((game) => (
                <GameCard key={game.name} game={game} variant={'frame'} />
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >


        </motion.div>

      </motion.div>

    </section>
  );
};
