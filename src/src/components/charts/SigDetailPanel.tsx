import React, { useMemo } from 'react'
import { useNetworkStore } from '@/store/networkStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import GlassCard from '@/components/ui/GlassCard'

const SigDetailPanel: React.FC = () => {
  const { selectedNode, networkData } = useNetworkStore()
  const isSigSelected = !!(selectedNode && networkData && selectedNode.node_type === 'sig')
  // 해당 시그의 멤버 목록 (훅은 항상 호출되도록 보장)
  const members = useMemo(() => {
    if (!networkData || !selectedNode || selectedNode.node_type !== 'sig') return []
    const memberIds = networkData.links.filter(l => l.target === selectedNode.id).map(l => l.source)
    const nodes = networkData.nodes.filter(n => memberIds.includes(n.id))
    return nodes
  }, [selectedNode, networkData])
  // 간이 꺾은선 데이터 (훅은 항상 호출)
  const lineData = useMemo(() => {
    const total = members.length
    if (total === 0) return [{ x: 0, count: 0 }]
    const step = Math.max(1, Math.floor(total / 12))
    const arr = [] as { x: number, count: number }[]
    for (let i = step; i <= total; i += step) {
      arr.push({ x: i, count: i })
    }
    if (arr[arr.length - 1]?.count !== total) {
      arr.push({ x: total, count: total })
    }
    return arr
  }, [members])
  // 리더/부리더 목록 (항상 호출)
  const leadership = useMemo(() => {
    if (!networkData || !selectedNode || selectedNode.node_type !== 'sig') {
      return { leaders: [] as typeof members, viceLeaders: [] as typeof members }
    }
    const leaders = members.filter(m =>
      networkData.links.some(l => l.source === m.id && l.target === selectedNode.id && l.relation_type === '시그장')
    )
    const viceLeaders = members.filter(m =>
      networkData.links.some(l => l.source === m.id && l.target === selectedNode.id && l.relation_type === '부시그장')
    )
    return { leaders, viceLeaders }
  }, [members, networkData, selectedNode])

  if (!isSigSelected) {
    return (
      <GlassCard className="p-6 text-white min-h-[560px] flex items-center justify-center">
        <div className="text-white/60">좌측에서 시그를 선택하세요</div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* 꺾은선 그래프 */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{selectedNode!.label}</h3>
            <div className="text-xs text-white/70 mt-1 flex items-center gap-2 flex-wrap">
              <span>총 {members.length}명</span>
              {leadership.leaders.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                  시그장: {leadership.leaders.map(l => l.label).join(', ')}
                </span>
              )}
              {leadership.viceLeaders.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  부시그장: {leadership.viceLeaders.map(l => l.label).join(', ')}
                </span>
              )}
            </div>
          </div>
          <span className="text-sm text-white/70">멤버 분포</span>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="x" stroke="#fff" tick={{ fontSize: 12 }} />
              <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="count" stroke="rgba(129, 212, 250, 0.9)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}

export default SigDetailPanel


