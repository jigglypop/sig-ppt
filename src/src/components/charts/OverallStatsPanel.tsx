import React, { useMemo } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import type { ChartData } from '@/types/network'
import { useNetworkStore } from '@/store/networkStore'

interface OverallStatsPanelProps {
  data: ChartData
}

const OverallStatsPanel: React.FC<OverallStatsPanelProps> = ({ data }) => {
  const { getBalancedTeams, networkData } = useNetworkStore()
  const teamCount = 8
  const federation = useMemo(() => getBalancedTeams(teamCount, { unique: 1, sigs: 0.5, crossDup: 2 }), [getBalancedTeams])
  const sigIdToName = useMemo(() => {
    const m = new Map<string, string>()
    data.sigStats.forEach(s => m.set(s.sigId, s.sigName))
    return m
  }, [data.sigStats])
  const imbalance = useMemo(() => {
    if (!federation) return 0
    const sizes = federation.teams.map(t => t.uniqueCount)
    if (sizes.length === 0) return 0
    return Math.max(...sizes) - Math.min(...sizes)
  }, [federation])

  const downloadText = (filename: string, content: string, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const buildFederationCsv = () => {
    if (!federation) return ''
    const header = ['team_index', 'team_unique_count', 'sig_id', 'sig_name', 'sig_total', 'sig_unique', 'sig_duplicate', 'sig_duplication_rate']
    const statById = new Map(data.sigStats.map(s => [s.sigId, s]))
    const rows: string[] = [header.join(',')]
    federation.teams.forEach((t, idx) => {
      t.sigIds.forEach(sigId => {
        const s = statById.get(sigId)
        const sigName = sigIdToName.get(sigId) || sigId
        rows.push([
          String(idx + 1),
          String(t.uniqueCount),
          sigId,
          '"' + sigName.replace(/"/g, '""') + '"',
          String(s?.totalMembers ?? ''),
          String(s?.uniqueMembers ?? ''),
          String(s?.duplicateMembers ?? ''),
          s ? (s.duplicationRate.toFixed(1)) : ''
        ].join(','))
      })
    })
    return rows.join('\n')
  }

  const buildMarkdownReport = () => {
    const lines: string[] = []
    const pct = (n: number) => `${n.toFixed(1)}%`
    const now = new Date().toLocaleString()
    lines.push(`# 시그 네트워크 분석 보고서`)
    lines.push('')
    lines.push(`생성일시: ${now}`)
    lines.push('')
    lines.push('## 1. 전체 개요')
    lines.push('')
    lines.push(`- 전체 시그: ${data.overallStats.totalSigs}개`)
    lines.push(`- 고유 회원: ${data.overallStats.totalUnique}명`)
    lines.push(`- 중복 회원: ${data.overallStats.totalDuplicates}명 (${pct((data.overallStats.totalDuplicates / Math.max(1, data.overallStats.totalUnique)) * 100)})`)
    lines.push(`- 평균 중복률(시그 평균): ${pct(data.overallStats.averageDuplicationRate)}`)
    lines.push(`- 시그당 평균 회원: ${(data.overallStats.totalMembers / Math.max(1, data.overallStats.totalSigs)).toFixed(1)}명`)
    if (networkData) {
      lines.push(`- 네트워크: 노드 ${networkData.nodes.length} | 링크 ${networkData.links.length}`)
    }
    lines.push('')
    lines.push('## 2. 8개 연합 균형 배치 요약')
    lines.push('')
    if (!federation) {
      lines.push('- 연합 데이터 없음')
    } else {
      const sizes = federation.teams.map(t => t.uniqueCount)
      const max = Math.max(...sizes)
      const min = Math.min(...sizes)
      const avg = sizes.reduce((a, b) => a + b, 0) / Math.max(1, sizes.length)
      const variance = sizes.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / Math.max(1, sizes.length)
      const stddev = Math.sqrt(variance)
      lines.push(`- 연합 수: ${federation.teams.length}개`)
      lines.push(`- 고유 인원 편차(최대-최소): ${max - min}명`)
      lines.push(`- 고유 인원 평균: ${avg.toFixed(1)}명, 표준편차: ${stddev.toFixed(1)}명`)
      // 연합 간 중복 인원(한 회원이 2개 이상 연합에 포함)
      const memberTeamCount = new Map<string, number>()
      federation.teamMembers.forEach((set) => {
        set.forEach(m => memberTeamCount.set(m, (memberTeamCount.get(m) || 0) + 1))
      })
      const crossDuplicates = Array.from(memberTeamCount.values()).filter(c => c > 1).length
      const crossDupRate = data.overallStats.totalUnique > 0 ? (crossDuplicates / data.overallStats.totalUnique) * 100 : 0
      lines.push(`- 연합 간 중복 회원: ${crossDuplicates}명 (${pct(crossDupRate)})`)
      const dist: Record<string, number> = {}
      memberTeamCount.forEach(c => { dist[String(c)] = (dist[String(c)] || 0) + 1 })
      lines.push('')
      lines.push('| 가입 연합 수 | 회원 수 | 비율 |')
      lines.push('|---:|---:|---:|')
      Object.keys(dist).sort((a,b)=>Number(a)-Number(b)).forEach(k => {
        const cnt = dist[k]
        const ratio = data.overallStats.totalUnique > 0 ? (cnt / data.overallStats.totalUnique) * 100 : 0
        lines.push(`| ${k} | ${cnt} | ${pct(ratio)} |`)
      })
      lines.push('')
      lines.push('| 연합 | 고유 인원 | 시그 수 | 시그 목록 |')
      lines.push('|---:|---:|---:|---|')
      federation.teams.forEach((t, i) => {
        const names = t.sigIds.map(id => sigIdToName.get(id) || id).join(', ')
        lines.push(`| ${i + 1} | ${t.uniqueCount} | ${t.sigIds.length} | ${names} |`)
      })
    }
    lines.push('')
    lines.push('## 3. 시그별 지표')
    lines.push('')
    lines.push('| 시그 | 총원 | 단독 | 중복 | 중복률 |')
    lines.push('|---|---:|---:|---:|---:|')
    data.sigStats.forEach(s => {
      lines.push(`| ${s.sigName} | ${s.totalMembers} | ${s.uniqueMembers} | ${s.duplicateMembers} | ${pct(s.duplicationRate)} |`)
    })
    lines.push('')
    lines.push('## 4. 중복 가입 분포')
    lines.push('')
    const distribution: Record<string, number> = {}
    data.memberDuplications.forEach(m => {
      const key = `${m.count}`
      distribution[key] = (distribution[key] || 0) + 1
    })
    lines.push('| 가입 시그 수 | 회원 수 |')
    lines.push('|---:|---:|')
    Object.keys(distribution).sort((a, b) => Number(a) - Number(b)).forEach(k => {
      lines.push(`| ${k} | ${distribution[k]} |`)
    })
    lines.push('')
    lines.push('> 본 보고서는 Rust WASM 분석 결과 및 균형 배치 알고리즘(탐욕적 최소편차)을 기반으로 생성되었습니다.')
    return lines.join('\n')
  }

  const handleDownloadFederationCsv = () => {
    const csv = buildFederationCsv()
    if (csv) downloadText('federations.csv', csv, 'text/csv;charset=utf-8')
  }

  const handleDownloadReportMd = () => {
    const md = buildMarkdownReport()
    downloadText('analysis_report.md', md, 'text/markdown;charset=utf-8')
  }
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
