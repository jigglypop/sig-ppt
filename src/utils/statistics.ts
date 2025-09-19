import type { Sig, Category } from '../types/sig';

export interface Statistics {
  totalSigs: number;
  totalMembers: number;
  categoryCounts: { category: string; count: number; name: string; icon: string }[];
  topCategories: { category: string; percentage: number; name: string }[];
  recentlyCreated: Sig[];
  mostActive: Sig[];
}

export const generateStatistics = (sigs: Sig[], categories: Record<string, Category>): Statistics => {
  // 카테고리별 시그 수 계산
  const categoryMap = new Map<string, number>();
  sigs.forEach(sig => {
    categoryMap.set(sig.category, (categoryMap.get(sig.category) || 0) + 1);
  });

  const categoryCounts = Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      name: categories[category]?.name || category,
      icon: categories[category]?.icon || '📌'
    }))
    .sort((a, b) => b.count - a.count);

  // 상위 카테고리 계산
  const topCategories = categoryCounts.slice(0, 5).map(item => ({
    category: item.category,
    percentage: Math.round((item.count / sigs.length) * 100),
    name: item.name
  }));

  // 임의의 활발한 시그들 (실제로는 API에서 가져와야 함)
  const mostActive = sigs
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  // 최근 생성된 시그들 (임의로 선택)
  const recentlyCreated = sigs
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return {
    totalSigs: sigs.length,
    totalMembers: Math.floor(Math.random() * 500) + 1000, // 임시 데이터
    categoryCounts,
    topCategories,
    recentlyCreated,
    mostActive
  };
};
