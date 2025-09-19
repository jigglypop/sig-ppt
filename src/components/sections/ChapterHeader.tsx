import { motion } from 'framer-motion'

interface ChapterHeaderProps {
  title: string
  subtitle?: string
  id?: string
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({ title, subtitle, id }) => {
  return (
    <section id={id} className="min-h-[40vh] py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-1/3 w-[520px] h-[520px] rounded-full grad-aurora blur-3xl opacity-50" />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-title mb-4"
        >
          <span className="text-underline-clean" style={{ "--underline-scale": 1 } as any}>{title}</span>
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/80 text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default ChapterHeader


