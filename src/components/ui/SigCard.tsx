import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import type { Sig, Category } from '../../types/sig';
import { ExternalLink, Mail, Instagram, Users, ImageIcon } from 'lucide-react';

interface SigCardProps {
  sig: Sig;
  category: Category;
  index?: number;
}

export const SigCard: React.FC<SigCardProps> = ({ sig, category }) => {
  const [hasImage, setHasImage] = useState(Boolean(sig.image));
  const [isLowRes, setIsLowRes] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;
    const lowByArea = naturalWidth * naturalHeight < 400_000;
    const lowBySide = naturalWidth < 600 || naturalHeight < 400;
    setIsLowRes(lowByArea || lowBySide);
  }, []);

  const handleImageError = useCallback(() => {
    setHasImage(false);
  }, []);

  useEffect(() => {
    if (isDetailOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isDetailOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDetailOpen(false);
    };
    if (isDetailOpen) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [isDetailOpen]);

  return (
    <article className="relative w-full h-full rounded-2xl overflow-hidden min-h-[360px]">
      <div className="neon-border absolute inset-0 rounded-2xl pointer-events-none" />

      <div className="glass rounded-2xl p-5 flex flex-col gap-4 relative h-full">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden neon-soft">
            {hasImage ? (
              <img
                src={`/images/${sig.image}`}
                alt={sig.name}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="w-full h-full object-contain p-1"
                style={isLowRes ? { objectFit: 'contain', transform: 'scale(0.9)' } : undefined}
              />
            ) : (
              <ImageIcon className="w-7 h-7 text-white/50" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl">
            <motion.span 
              className="font-title text-underline-clean"
              initial={{ "--underline-scale": 0 }}
              animate={{ "--underline-scale": 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{ "--underline-scale": 0 } as any}
            >
              {sig.name}
            </motion.span>
            <br />
          </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`tag tag-${sig.category}`}>
                {category.name}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex-1">
          <p className="text-gray-300 text-sm sm:text-base font-light mb-2">
            {sig.fullName}
          </p>
          <p className={`text-gray-400 text-sm line-clamp-2`}>
            {sig.description}
          </p>
          <div className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Users className="w-4 h-4" />
            <span>시그장 {sig.leader}</span>
          </div>
          <div className="flex items-center gap-2">
            {sig.email && (
              <a href={`mailto:${sig.email}`} className="btn-ghost text-xs">
                <Mail className="w-4 h-4" /> 메일
              </a>
            )}
            {sig.instagram && (
              <a
                href={`https://instagram.com/${sig.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs"
              >
                <Instagram className="w-4 h-4" /> 인스타
              </a>
            )}
            {sig.joinLink && (
              <a
                href={sig.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn text-xs"
              >
                <ExternalLink className="w-4 h-4" /> 가입 신청
              </a>
            )}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={() => setIsDetailOpen(true)} className="flex-1 btn btn-ghost">
            자세히 보기
          </button>
          <a
            href={`https://www.mensakorea.org/bbs/write.php?bo_table=sig_request&sig_id=sig_${sig.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-brand px-4"
          >
            가입신청
          </a>
          <a
            href={`https://www.mensakorea.org/bbs/board.php?bo_table=sig&wr_id=${sig.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost px-4"
          >
            공식정보
          </a>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isDetailOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsDetailOpen(false)}
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
              >
                <div className="glass-dark w-full h-full sm:h-[90vh] sm:max-w-3xl sm:w-full sm:rounded-2xl overflow-hidden border border-white/10">
                  <div className="h-full overflow-y-auto custom-scroll">
                    <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/10 p-4 sm:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden neon-soft flex-shrink-0">
                          <ImageIcon className="w-5 h-5 text-white/60" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-title text-2xl sm:text-3xl text-white truncate">{sig.name}</h3>
                          <p className="text-gray-400 text-xs sm:text-sm truncate">#{category.name} · 시그장 {sig.leader}</p>
                        </div>
                      </div>
                      <button onClick={() => setIsDetailOpen(false)} className="btn-ghost text-sm" aria-label="닫기">
                        닫기
                      </button>
                    </div>

                    <div className="p-5 sm:p-6 space-y-5">
                      <div className="space-y-3">
                        <p className="text-gray-300 text-base sm:text-lg">{sig.fullName}</p>
                        <p className="text-gray-400 text-sm sm:text-base leading-7 whitespace-pre-line">{sig.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {sig.email && (
                          <a href={`mailto:${sig.email}`} className="btn text-sm">
                            <Mail className="w-4 h-4" /> 메일 문의
                          </a>
                        )}
                        {sig.instagram && (
                          <a href={`https://instagram.com/${sig.instagram}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                            <Instagram className="w-4 h-4" /> 인스타
                          </a>
                        )}
                        {sig.joinLink && (
                          <a href={sig.joinLink} target="_blank" rel="noopener noreferrer" className="btn text-sm">
                            <ExternalLink className="w-4 h-4" /> 가입 신청
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </article>
  );
};
