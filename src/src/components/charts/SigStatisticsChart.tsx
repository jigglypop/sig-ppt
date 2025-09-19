import React from 'react'
import GlassCard from '@/components/ui/GlassCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { SigStatistics } from '@/types/network'

interface SigStatisticsChartProps {
  data: SigStatistics[]
}

const SigStatisticsChart: React.FC<SigStatisticsChartProps> = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.totalMembers - a.totalMembers)
  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">시그별 회원 통계 (가로형 스택)</h3>
      <div style={{ height: 520 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sorted}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis 
              dataKey="sigName"
              stroke="#fff"
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              stroke="#fff" 
              label={{ value: '회원 수', angle: -90, position: 'insideLeft', offset: 10, fill: '#fff' }}
              width={70}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend iconType="rect" />
            
            <Bar 
              dataKey="uniqueMembers" 
              name="단독" 
              stackId="a"
              fill="rgba(130, 202, 157, 0.55)" 
              stroke="rgba(130, 202, 157, 0.95)"
              strokeWidth={1}
              barSize={16}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="duplicateMembers" 
              name="중복" 
              stackId="a"
              fill="rgba(255, 124, 124, 0.45)" 
              stroke="rgba(255, 124, 124, 0.9)"
              strokeWidth={1}
              barSize={16}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export default SigStatisticsChart
