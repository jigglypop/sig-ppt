import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SigCard } from './SigCard';
import type { Sig, Category } from '../../types/sig';
import { Search, Filter } from 'lucide-react';

interface SigGalleryProps {
  sigs: Sig[];
  categories: Record<string, Category>;
}

export const SigGallery: React.FC<SigGalleryProps> = ({ sigs, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredSigs = useMemo(() => {
    return sigs.filter(sig => {
      const matchesSearch = sig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sig.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sig.leader.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || sig.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sigs, searchTerm, selectedCategory]);

  const categoryList = Object.entries(categories).map(([key, value]) => ({
    key,
    ...value
  }));

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl">
            <motion.span 
              className="font-title text-underline-clean"
              initial={{ "--underline-scale": 0 }}
              animate={{ "--underline-scale": 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{ "--underline-scale": 0 } as any}
            >
              시그 갤러리
            </motion.span>
            <br />
          </h1>
          <p className="text-gray-300 text-base sm:text-lg px-4">관심사에 맞는 시그를 찾아보세요</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="시그 이름, 설명, 시그장으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn"
            >
              <Filter className="w-5 h-5" />
              필터
            </motion.button>
          </div>

          {/* Category Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'glass-light text-white ring-2 ring-purple-500/50'
                        : 'btn-ghost text-gray-300 hover:text-white'
                    }`}
                  >
                    전체 ({sigs.length})
                  </motion.button>
                  {categoryList.map((category) => {
                    const count = sigs.filter(sig => sig.category === category.key).length;
                    return (
                      <motion.button
                        key={category.key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category.key
                            ? 'glass-light text-white ring-2 ring-purple-500/50'
                            : 'btn-ghost text-gray-300 hover:text-white'
                        }`}
                      >
                        {category.name} ({count})
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-gray-400"
        >
          {filteredSigs.length}개의 시그를 찾았습니다
        </motion.div>

        {/* Sig Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${searchTerm}-${selectedCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredSigs.map((sig, index) => (
              <SigCard
                key={sig.id}
                sig={sig}
                category={categories[sig.category]}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredSigs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-500 mt-2">다른 검색어나 카테고리를 시도해보세요</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
