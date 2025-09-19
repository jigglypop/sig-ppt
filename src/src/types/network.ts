// 네트워크 시각화 관련 타입 정의

export interface NetworkNode {
  id: string
  label: string
  node_type: 'sig' | 'member'
  size: number
  color: string
  x: number
  y: number
  z: number
}

export interface NetworkLink {
  source: string
  target: string
  weight: number
  relation_type: string
}

export interface NetworkData {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

export interface SigMember {
  member_id: string
  name: string | null
  role: string
  sig_id: string
  sig_name: string
  phone: string | null
  member_number: string
  expire_date: string | null
}

export interface AnalysisResult {
  total_sigs: number
  total_members: number
  total_positions: number
  duplicate_members: number
  duplication_rate: number
  network: NetworkData
}

// 차트/파생 데이터 타입
export interface SigStatistics {
  sigId: string
  sigName: string
  totalMembers: number
  uniqueMembers: number
  duplicateMembers: number
  duplicationRate: number
}

export interface MemberDuplication {
  memberId: string
  memberName: string
  sigs: string[]
  count: number
}

export interface ChartData {
  sigStats: SigStatistics[]
  memberDuplications: MemberDuplication[]
  overallStats: {
    totalSigs: number
    totalMembers: number
    totalUnique: number
    totalDuplicates: number
    averageDuplicationRate: number
  }
}

export interface VisualizationConfig {
  showLabels: boolean
  animationSpeed: number
  nodeSize: number
  linkOpacity: number
  autoRotate: boolean
  colorScheme: 'default' | 'high-contrast' | 'colorblind-friendly'
  layoutAlgorithm: 'circular' | 'force-directed' | 'hierarchical'
}

export interface CameraPosition {
  x: number
  y: number
  z: number
  targetX: number
  targetY: number
  targetZ: number
}

export interface InteractionState {
  selectedNode: NetworkNode | null
  hoveredNode: NetworkNode | null
  highlightedNodes: Set<string>
  cameraPosition: CameraPosition
}

// WASM 모듈 인터페이스
export interface WasmSigAnalyzer {
  new(): WasmSigAnalyzer
  parse_csv_data(csv_data: string): void
  analyze(): AnalysisResult
}

// 업로드 원본에서 보조 메타 정보 (회원번호, 시그별 역할 등)
export interface MemberMeta {
  memberId: string
  name: string | null
  memberNumber: string | null
  rolesBySigId: Record<string, string>
}

export type MemberMetaByMemberId = Record<string, MemberMeta>
