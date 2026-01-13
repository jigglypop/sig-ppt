export interface Sig {
  id: string;
  name: string;
  fullName: string;
  leader: string;
  description: string;
  category: string;
  image: string | null;
  joinLink: string | null;
  /** 멘사코리아 가입신청 페이지의 sig_id (예: Domaine -> sig_Domaine) */
  requestId?: string;
  color: string;
  email?: string;
  instagram?: string;
  wrId?: number; // 멘사코리아 게시판 ID
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface SigData {
  sigs: Sig[];
  categories: Record<string, Category>;
}

export interface SigListOverallStats {
  totalSigs: number;
  totalUnique: number;
  totalDuplicates: number;
  averageDuplicationRate: number;
  duplicateJoinRate: number;
  averageMembersPerSig: number;
  averageDuplicationsPerDuplicate: number;
  totalMembers: number;
}

export interface SigListSigStat {
  sigName: string;
  totalMembers: number;
  duplicationRate: number;
}

export interface SigListCategoryStat {
  name: string;
  percentage: number;
}

export interface SigListData {
  overallStats: SigListOverallStats;
  sigStats: SigListSigStat[];
  categories: SigListCategoryStat[];
}