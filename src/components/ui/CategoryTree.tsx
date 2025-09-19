import { useMemo, useState } from 'react';
import type { Sig, Category } from '../../types/sig';
import { ChevronRight } from 'lucide-react';

interface CategoryTreeProps {
  categories: Record<string, Category>;
  sigs: Sig[];
  referenceOrder?: string[];
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, sigs }) => {
  const usedCategoryKeys = useMemo(() => new Set(sigs.map((s) => s.category)), [sigs]);
  const countByCategory = useMemo(() => {
    const count = new Map<string, number>();
    for (const s of sigs) count.set(s.category, (count.get(s.category) || 0) + 1);
    return count;
  }, [sigs]);

  const taxonomy = useMemo(
    () => [
      { key: 'edu', label: '교육/학문', children: ['study', 'academic'] },
      { key: 'culture', label: '문화/예술', children: ['art', 'culture', 'music'] },
      { key: 'hobby', label: '취미/레저/스포츠', children: ['hobby', 'sports'] },
      { key: 'game', label: '게임', children: ['game'] },
      { key: 'tech', label: '기술/컴퓨터', children: ['tech'] },
      { key: 'life', label: '생활/가정/반려', children: ['life', 'pet'] },
      { key: 'society', label: '사회/토론', children: ['social', 'discussion'] },
      { key: 'economy', label: '경제/비즈니스', children: ['finance', 'business'] },
    ],
    []
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(taxonomy.map((g) => [g.key, true]))
  );

  const toggle = (key: string) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl p-6">
        <h3 className="text-xl font-title text-white mb-4">카테고리 트리</h3>
        <div className="tree">
          <ul>
            {taxonomy.map((group) => {
              const groupCount = group.children.reduce(
                (acc, key) => acc + (countByCategory.get(key) || 0),
                0
              );
              return (
                <li key={group.key} className="mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-expanded={openGroups[group.key]}
                      onClick={() => toggle(group.key)}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-md glass hover:bg-white/10 transition"
                    >
                      <ChevronRight
                        className={`w-4 h-4 text-white/80 transition-transform ${
                          openGroups[group.key] ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    <div className="flex items-center justify-between flex-1 pr-2">
                      <span className="text-white font-medium">{group.label}</span>
                      <span className="text-xs text-gray-400">{groupCount}개</span>
                    </div>
                  </div>
                  {openGroups[group.key] && (
                    <ul className="mt-2">
                      {group.children.map((key) => {
                        const cat = categories[key];
                        if (!cat) return null;
                        const isUsed = usedCategoryKeys.has(key);
                        const count = countByCategory.get(key) || 0;
                        return (
                          <li key={key} className="py-1">
                            <div
                              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                                isUsed ? 'bg-white/5' : 'bg-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-base">{cat.icon}</span>
                                <span className="text-sm text-white truncate">{cat.name}</span>
                              </div>
                              <span className={`text-2xs px-2 py-1 rounded-full ${
                                isUsed ? 'tag-neon' : 'tag-muted'
                              }`}>{count}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
