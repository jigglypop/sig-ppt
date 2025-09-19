import React, { useMemo } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import type { ChartData } from '@/types/network'
import { useNetworkStore } from '@/store/networkStore'

interface OverallStatsPanelProps {
  data: ChartData
}

const OverallStatsPanel: React.FC<OverallStatsPanelProps> = ({ data }) => {
  const { getBalancedTeams } = useNetworkStore()
  const teamCount = 8
  useMemo(() => getBalancedTeams(teamCount, { unique: 1, sigs: 0.5, crossDup: 2 }), [getBalancedTeams])
  // removed unused imbalance

  // downloadText removed

  // const buildFederationCsv = () => ''

  // removed full report builder

  // export handlers disabled per request

  // const handleDownloadReportMd = () => {}
  const stats = [
    {
      label: '전체 시그',
      value: data.overallStats.totalSigs,
      unit: '개',
      color: 'text-white',
      bgColor: 'bg-white/10',
      icon: '🏢'
    },
    {
      label: '고유 회원',
      value: data.overallStats.totalUnique,
      unit: '명',
      color: 'text-white',
      bgColor: 'bg-white/10',
      icon: '👤'
    },
    {
      label: '중복 회원',
      value: data.overallStats.totalDuplicates,
      unit: '명',
      color: 'text-white',
      bgColor: 'bg-white/10',
      icon: '👥'
    },
    {
      label: '평균 중복률',
      value: data.overallStats.averageDuplicationRate.toFixed(1),
      unit: '%',
      color: 'text-white',
      bgColor: 'bg-white/10',
      icon: '📊'
    },
    {
      label: '중복 가입률',
      value: ((data.overallStats.totalDuplicates / data.overallStats.totalUnique) * 100).toFixed(1),
      unit: '%',
      color: 'text-white',
      bgColor: 'bg-white/10',
      icon: '📈'
    }
  ]
  
  return (
    <>
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">전체 통계 요약</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass rounded-xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${stat.color}`}>
                {stat.unit}
              </span>
            </div>
            <p className={`text-3xl font-bold bg-clip-text text-transparent`} style={{ backgroundImage: 'linear-gradient(90deg, #6a82fb, #fc5c7d)' }}>
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-white/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* 추가 통계 정보 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-2">시그별 평균 회원 수</h3>
          <p className="text-2xl font-bold text-cyan-400">
            {(data.overallStats.totalMembers / data.overallStats.totalSigs).toFixed(1)}명
          </p>
          <p className="text-sm text-white/60 mt-1">
            시그당 평균 {Math.floor(data.overallStats.totalMembers / data.overallStats.totalSigs)}~
            {Math.ceil(data.overallStats.totalMembers / data.overallStats.totalSigs)}명의 회원 보유
          </p>
        </div>
        
        <div className="glass rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-2">평균 중복 가입 수</h3>
          <p className="text-2xl font-bold text-pink-400">
            {data.memberDuplications.length > 0 
              ? (data.memberDuplications.reduce((sum, m) => sum + m.count, 0) / data.memberDuplications.length).toFixed(1)
              : '0'}개
          </p>
          <p className="text-sm text-white/60 mt-1">
            중복 회원은 평균적으로 {Math.floor(data.memberDuplications.reduce((sum, m) => sum + m.count, 0) / data.memberDuplications.length)}개 이상의 시그에 가입
          </p>
        </div>
      </div>
    </GlassCard>
    </>
  )
}

export default OverallStatsPanel
