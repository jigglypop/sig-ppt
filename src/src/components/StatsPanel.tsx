import React from 'react'
import { useNetworkStore } from '@/store/networkStore'
import GlassCard from '@/components/ui/GlassCard'

const StatsPanel: React.FC = () => {
  const { analysisResult, networkData } = useNetworkStore()
  if (!analysisResult) return null
  return (
    <GlassCard className="p-4 w-72 text-white">
      <h3 className="text-lg font-semibold mb-3">전체 통계</h3>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div><div className="text-2xl font-bold text-blue-400">{analysisResult.total_sigs}</div><div className="text-xs text-gray-300">시그 수</div></div>
        <div><div className="text-2xl font-bold text-green-400">{analysisResult.total_members}</div><div className="text-xs text-gray-300">순수 인원</div></div>
        {/* 총 직책 UI 제거 */}
        <div><div className="text-2xl font-bold text-red-400">{analysisResult.duplicate_members}</div><div className="text-xs text-gray-300">중복 인원</div></div>
      </div>
      {networkData && (<div className="mt-3 pt-3 border-t border-white/20 text-xs text-gray-300">노드 {networkData.nodes.length} | 링크 {networkData.links.length}</div>)}
    </GlassCard>
  )
}

export default StatsPanel


