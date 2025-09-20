import { motion } from 'framer-motion'

const TARGET_URL = 'https://aggjack.com/'

export const SigWebsitePreviewSection: React.FC = () => {
  return (
    <section id="sig-website" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-3xl font-title text-white">
            <motion.span
              className="text-underline-clean"
              initial={{ "--underline-scale": 0 } as any}
              whileInView={{ "--underline-scale": 1 } as any}
              transition={{ duration: 0.9 }}
              style={{ "--underline-scale": 0 } as any}
            >
              시그 홈페이지 미리보기
            </motion.span>
          </h2>
          <p className="text-white/80 mt-2">외부 예시 페이지를 임베드하여 미리 확인할 수 있습니다. 일부 사이트는 보안 정책으로 임베드가 제한될 수 있습니다.</p>
          <div className="mt-3">
            <a href={TARGET_URL} target="_blank" rel="noopener noreferrer" className="btn btn-brand px-4 py-2">새 창에서 열기</a>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden ring-1 ring-white/10">
          <div className="w-full h-[70vh] min-h-[480px] bg-black">
            <iframe
              src={TARGET_URL}
              title="SIG Homepage Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SigWebsitePreviewSection


