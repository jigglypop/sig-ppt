import React from 'react'
import GlassCard from '@/components/ui/GlassCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { ChartData } from '@/types/network'

interface DuplicationAnalysisChartProps {
  data: ChartData
}

const DuplicationAnalysisChart: React.FC<DuplicationAnalysisChartProps> = ({ data }) => {
  // 중복 회원 분포 데이터 (몇 개 시그에 속해있는지)
  const duplicationDistribution = data.memberDuplications.reduce((acc: Record<string, number>, member) => {
    const key = `${member.count}개 시그`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  
  const distributionData = Object.entries(duplicationDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name))
  
  // 파이 차트 데이터 (전체 회원 중 중복/단독 비율)
  const pieData = [
    { name: '단독 가입', value: data.overallStats.totalUnique - data.overallStats.totalDuplicates },
    { name: '중복 가입', value: data.overallStats.totalDuplicates },
  ]
  
  const COLORS = ['#6a82fb', '#fc5c7d']
  const DISTRIBUTION_COLORS = ['#6a82fb', '#fc5c7d', '#22d3ee', '#a78bfa']
  
  // 상위 목록 제거 요구로 미사용
  
  return (
    <div className="space-y-6">
      {/* 전체 중복률 파이 차트 */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">전체 회원 중복 현황</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex flex-col justify-center space-y-3 text-white">
            <div>
              <p className="text-2xl font-bold">{data.overallStats.totalUnique}명</p>
              <p className="text-sm text-white/60">전체 고유 회원</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{data.overallStats.totalDuplicates}명</p>
              <p className="text-sm text-white/60">중복 가입 회원</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {((data.overallStats.totalDuplicates / data.overallStats.totalUnique) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-white/60">중복 가입률</p>
            </div>
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">중복 가입 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" name="회원 수">
              {distributionData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  )
}

export default DuplicationAnalysisChart
