export interface Sig {
  id: string;
  name: string;
  fullName: string;
  leader: string;
  description: string;
  category: string;
  image: string | null;
  joinLink: string | null;
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
