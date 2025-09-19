import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  NetworkData, 
  NetworkNode, 
  AnalysisResult, 
  VisualizationConfig,
  ChartData,
  SigStatistics,
  MemberDuplication,
} from '@/types/network'

interface NetworkStore {
  // 상태
  analysisResult: AnalysisResult | null
  networkData: NetworkData | null
  selectedNode: NetworkNode | null
  hoveredNode: NetworkNode | null
  highlightedNodes: Set<string>
  isLoading: boolean
  error: string | null
  // 메타
  memberNumberByMemberId: Record<string, string>
  leadersBySigId: Record<string, string[]>
  viceLeadersBySigId: Record<string, string[]>
  
  // 설정
  config: VisualizationConfig
  
  // 액션
  setAnalysisResult: (result: AnalysisResult | null) => void
  setNetworkData: (data: NetworkData | null) => void
  setSelectedNode: (node: NetworkNode | null) => void
  setHoveredNode: (node: NetworkNode | null) => void
  setHighlightedNodes: (nodeIds: string[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateConfig: (config: Partial<VisualizationConfig>) => void
  setMemberNumberMap: (map: Record<string, string>) => void
  setLeadersBySigId: (m: Record<string, string[]>) => void
  setViceLeadersBySigId: (m: Record<string, string[]>) => void
  
  // 헬퍼 메서드
  findConnectedNodes: (nodeId: string) => string[]
  getNodeByType: (type: 'sig' | 'member') => NetworkNode[]
  getNodeConnections: (nodeId: string) => { incoming: string[], outgoing: string[] }
  clearSelection: () => void
  resetStore: () => void
  // 우측 시그 목록
  getSigList: () => { id: string, label: string, count: number }[]
  // 차트 데이터 계산
  getChartData: () => ChartData | null
  // 팀 분할 계산 (중복 제거한 팀별 유니크 인원 균형화)
  getBalancedTeams: (teamCount?: number, weights?: { unique: number, sigs: number, crossDup: number }) => { teams: { sigIds: string[], uniqueCount: number }[], teamMembers: Array<Set<string>> } | null
}

const defaultConfig: VisualizationConfig = {
  showLabels: true,
  animationSpeed: 1,
  nodeSize: 1,
  linkOpacity: 0.6,
  autoRotate: true,
  colorScheme: 'default',
  layoutAlgorithm: 'circular',
}

export const useNetworkStore = create<NetworkStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      analysisResult: null,
      networkData: null,
      selectedNode: null,
      hoveredNode: null,
      highlightedNodes: new Set(),
      isLoading: false,
      error: null,
      config: defaultConfig,
      memberNumberByMemberId: {},
      leadersBySigId: {},
      viceLeadersBySigId: {},
      
      // 상태 설정 액션들
      setAnalysisResult: (result) => {
        set({ 
          analysisResult: result,
          networkData: result?.network || null,
          error: null,
        })
      },
      
      setNetworkData: (data) => set({ networkData: data }),
      
      setSelectedNode: (node) => {
        const { networkData } = get()
        if (!networkData) return
        
        // 선택된 노드와 연결된 노드들 하이라이트
        const connectedNodes = node ? get().findConnectedNodes(node.id) : []
        
        set({ 
          selectedNode: node,
          highlightedNodes: new Set(node ? [node.id, ...connectedNodes] : [])
        })
      },
      
      setHoveredNode: (node) => set({ hoveredNode: node }),
      
      setHighlightedNodes: (nodeIds) => set({ 
        highlightedNodes: new Set(nodeIds) 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
      })),

      setMemberNumberMap: (map) => set({ memberNumberByMemberId: map }),
      setLeadersBySigId: (m) => set({ leadersBySigId: m }),
      setViceLeadersBySigId: (m) => set({ viceLeadersBySigId: m }),
      
      // 헬퍼 메서드들
      findConnectedNodes: (nodeId: string): string[] => {
        const { networkData } = get()
        if (!networkData) return []
        
        const connections: string[] = []
        
        networkData.links.forEach(link => {
          if (link.source === nodeId) {
            connections.push(link.target)
          } else if (link.target === nodeId) {
            connections.push(link.source)
          }
        })
        
        return connections
      },
      
      getNodeByType: (type: 'sig' | 'member'): NetworkNode[] => {
        const { networkData } = get()
        if (!networkData) return []
        
        return networkData.nodes.filter(node => node.node_type === type)
      },
      
      getNodeConnections: (nodeId: string) => {
        const { networkData } = get()
        if (!networkData) return { incoming: [], outgoing: [] }
        
        const incoming: string[] = []
        const outgoing: string[] = []
        
        networkData.links.forEach(link => {
          if (link.target === nodeId) {
            incoming.push(link.source)
          }
          if (link.source === nodeId) {
            outgoing.push(link.target)
          }
        })
        
        return { incoming, outgoing }
      },
      getSigList: () => {
        const { networkData } = get()
        if (!networkData) return []
        const list = networkData.nodes
          .filter(n => n.node_type === 'sig')
          .map(n => ({ id: n.id, label: n.label, count: networkData.links.filter(l => l.target === n.id).length }))
          .sort((a, b) => b.count - a.count)
        return list
      },
      
      clearSelection: () => set({ 
        selectedNode: null, 
        hoveredNode: null, 
        highlightedNodes: new Set() 
      }),
      
      resetStore: () => set({
        analysisResult: null,
        networkData: null,
        selectedNode: null,
        hoveredNode: null,
        highlightedNodes: new Set(),
        isLoading: false,
        error: null,
        config: defaultConfig,
        memberNumberByMemberId: {},
        leadersBySigId: {},
        viceLeadersBySigId: {},
      }),
      
      getChartData: (): ChartData | null => {
        const { networkData, analysisResult } = get()
        if (!networkData || !analysisResult) return null
        
        // 시그별 통계 계산
        const sigNodes = networkData.nodes.filter(n => n.node_type === 'sig')
        const sigStats: SigStatistics[] = sigNodes.map(sig => {
          // 해당 시그에 연결된 모든 멤버 찾기
          const members = networkData.links
            .filter(link => link.target === sig.id)
            .map(link => link.source)
          
          // 중복 멤버 찾기 (다른 시그에도 속한 멤버)
          const duplicateMembers = members.filter(memberId => {
            const memberLinks = networkData.links.filter(l => l.source === memberId)
            return memberLinks.length > 1
          })
          
          return {
            sigId: sig.id,
            sigName: sig.label,
            totalMembers: members.length,
            uniqueMembers: members.length - duplicateMembers.length,
            duplicateMembers: duplicateMembers.length,
            duplicationRate: members.length > 0 ? (duplicateMembers.length / members.length) * 100 : 0
          }
        }).sort((a, b) => b.totalMembers - a.totalMembers)
        
        // 멤버 중복 분석
        const memberNodes = networkData.nodes.filter(n => n.node_type === 'member')
        const memberDuplications: MemberDuplication[] = memberNodes
          .map(member => {
            const sigs = networkData.links
              .filter(link => link.source === member.id)
              .map(link => {
                const sigNode = networkData.nodes.find(n => n.id === link.target)
                return sigNode?.label || link.target
              })
            
            return {
              memberId: member.id,
              memberName: member.label,
              sigs: sigs,
              count: sigs.length
            }
          })
          .filter(m => m.count > 1)
          .sort((a, b) => b.count - a.count)
        
        // 전체 통계
        const totalUnique = memberNodes.length
        const totalDuplicates = memberDuplications.length
        const averageDuplicationRate = sigStats.length > 0
          ? sigStats.reduce((sum, stat) => sum + stat.duplicationRate, 0) / sigStats.length
          : 0
        
        return {
          sigStats,
          memberDuplications,
          overallStats: {
            totalSigs: analysisResult.total_sigs,
            totalMembers: analysisResult.total_positions,
            totalUnique,
            totalDuplicates,
            averageDuplicationRate
          }
        }
      },

      getBalancedTeams: (teamCount = 8, weights = { unique: 1, sigs: 0.5, crossDup: 2 }) => {
        const { networkData } = get()
        if (!networkData) return null

        // 시그별 멤버 집합 생성
        const sigIds = networkData.nodes.filter(n => n.node_type === 'sig').map(n => n.id)
        const sigIdToMembers = new Map<string, Set<string>>()
        for (const sigId of sigIds) {
          const members = new Set<string>()
          networkData.links.forEach(l => {
            if (l.target === sigId) members.add(l.source)
          })
          sigIdToMembers.set(sigId, members)
        }

        // 시그를 멤버 수 내림차순으로 정렬
        const sortedSigIds = [...sigIds].sort((a, b) => (sigIdToMembers.get(b)!.size - sigIdToMembers.get(a)!.size))

        // 팀 초기화
        const teamMembers: Array<Set<string>> = Array.from({ length: teamCount }, () => new Set<string>())
        const teamSigs: Array<string[]> = Array.from({ length: teamCount }, () => [])

        const teamSizeArr = () => teamMembers.map(s => s.size)
        
        // 연합 간 중복 계산 함수
        const calculateCrossDuplicates = (newTeamMembers: Array<Set<string>>) => {
          const memberTeamCount = new Map<string, number>()
          newTeamMembers.forEach(set => {
            set.forEach(m => memberTeamCount.set(m, (memberTeamCount.get(m) || 0) + 1))
          })
          return Array.from(memberTeamCount.values()).filter(c => c > 1).length
        }

        for (const sigId of sortedSigIds) {
          const members = sigIdToMembers.get(sigId)!
          let bestTeam = 0
          let bestScore = Number.POSITIVE_INFINITY
          let bestNewSize = Number.POSITIVE_INFINITY

          for (let t = 0; t < teamCount; t++) {
            // delta = 새로운 멤버 수 증가분
            let delta = 0
            const tSet = teamMembers[t]
            members.forEach(m => { if (!tSet.has(m)) delta++ })
            
            // 임시로 이 팀에 배치했을 때의 상태 계산
            const newSizes = teamSizeArr()
            newSizes[t] = newSizes[t] + delta
            const uniqueSpread = Math.max(...newSizes) - Math.min(...newSizes)
            
            // 시그 수 스프레드
            const newSigCounts = teamSigs.map(s => s.length)
            newSigCounts[t] = newSigCounts[t] + 1
            const sigSpread = Math.max(...newSigCounts) - Math.min(...newSigCounts)
            
            // 연합 간 중복 계산 (임시 배치 후)
            const tempTeamMembers = teamMembers.map((set, idx) => {
              if (idx === t) {
                const newSet = new Set(set)
                members.forEach(m => newSet.add(m))
                return newSet
              }
              return set
            })
            const crossDuplicates = calculateCrossDuplicates(tempTeamMembers)
            
            // 종합 점수 (연합 간 중복 최소화에 높은 가중치)
            const score = weights.unique * uniqueSpread + weights.sigs * sigSpread + weights.crossDup * crossDuplicates
            const newSize = newSizes[t]
            
            if (score < bestScore || (score === bestScore && newSize < bestNewSize)) {
              bestScore = score
              bestNewSize = newSize
              bestTeam = t
            }
          }

          // 적용
          const tSet = teamMembers[bestTeam]
          members.forEach(m => tSet.add(m))
          teamSigs[bestTeam].push(sigId)
        }

        return {
          teams: teamSigs.map((sigIds, i) => ({ sigIds, uniqueCount: teamMembers[i].size })),
          teamMembers,
        }
      },
    }),
    {
      name: 'network-store',
      partialize: (state: any) => ({ 
        config: state.config 
      }), // 설정만 localStorage에 저장
    }
  )
)
