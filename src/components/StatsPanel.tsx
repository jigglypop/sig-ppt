import type { ReactNode } from 'react'

type AnalysisResult = {
  total_sigs: number
  total_members: number
  duplicate_members: number
}

type NetworkData = {
  nodes: unknown[]
  links: unknown[]
}

type StatsPanelProps = {
  analysisResult: AnalysisResult | null
  networkData?: NetworkData | null
  className?: string
  children?: ReactNode
}

const StatsPanel = ({ analysisResult, networkData, className }: StatsPanelProps) => {
  if (!analysisResult) return null

  return (
    <div className={`glass rounded-2xl p-4 w-72 text-white ${className ?? ''}`}>
      <h3 className="text-lg font-semibold mb-3">전체 통계</h3>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-400">{analysisResult.total_sigs}</div>
          <div className="text-xs text-gray-300">시그 수</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{analysisResult.total_members}</div>
          <div className="text-xs text-gray-300">순수 인원</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-400">{analysisResult.duplicate_members}</div>
          <div className="text-xs text-gray-300">중복 인원</div>
        </div>
      </div>
      {networkData && (
        <div className="mt-3 pt-3 border-t border-white/20 text-xs text-gray-300">
          노드 {networkData.nodes.length} | 링크 {networkData.links.length}
        </div>
      )}
    </div>
  )
}

export default StatsPanel


