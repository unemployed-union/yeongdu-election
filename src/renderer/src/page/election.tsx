import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Candidate, Winner } from '../../../shared/election'
import { Brand, EmptyState, Icon } from '../components/ui'
import { WinnerCelebration } from '../components/WinnerCelebration'
import { useCandidates, useElectionTitle, useWinners } from '../hooks/useElection'

interface VoteData extends Candidate {
  id: string
  color: string
}

const baseColors = ['#397a60', '#809b87', '#b79b6b', '#7399a4', '#a88a98']

export function ElectionPage(): React.JSX.Element {
  const [data, setData] = useState<VoteData[]>([])
  const candidates = useCandidates()
  const winners = useWinners()
  const title = useElectionTitle()
  const reducedMotion = useReducedMotion()
  const colorMapRef = useRef(new Map<string, string>())
  const [celebration, setCelebration] = useState<{ winner: Winner; id: number } | null>(null)
  const celebrationIdRef = useRef(0)
  const closeCelebration = useCallback(() => setCelebration(null), [])

  useEffect(
    () =>
      window.api.onWinnerConfirmed((winner) => {
        celebrationIdRef.current += 1
        setCelebration({ winner, id: celebrationIdRef.current })
      }),
    []
  )

  useEffect(() => {
    const colors = colorMapRef.current

    function getColor(id: string): string {
      let color = colors.get(id)
      if (color === undefined) {
        color = baseColors[colors.size % baseColors.length]
        colors.set(id, color)
      }
      return color
    }

    setData(
      Object.entries(candidates)
        .map(([id, count]) => ({ id, name: id, votes: count, color: getColor(id) }))
        .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name))
    )
  }, [candidates])

  const maxVotes = useMemo(() => Math.max(...data.map((row) => row.votes), 1), [data])
  const totalVotes = useMemo(() => data.reduce((sum, row) => sum + row.votes, 0), [data])

  return (
    <div className="result-page">
      <header className="result-topbar">
        <Brand />
        <span className="live-badge">
          <span className="status-dot" />
          실시간 집계
        </span>
      </header>
      <section className="result-intro">
        <span className="eyebrow">EVERY VOTE COUNTS</span>
        <h1 title={title || '우리의 선택, 함께 보는 결과'}>
          {title || '우리의 선택, 함께 보는 결과'}
        </h1>
        <p>소중한 한 표가 모여, 새로운 시작을 만듭니다.</p>
        <div className="result-metrics">
          <span>
            등록 후보
            <strong>
              {data.length}
              <small>명</small>
            </strong>
          </span>
          <span>
            총 득표
            <strong>
              {totalVotes.toLocaleString()}
              <small>표</small>
            </strong>
          </span>
        </div>
      </section>
      <section className="panel result-chart" aria-labelledby="results-heading">
        <div className="panel-heading">
          <h2 id="results-heading">
            <Icon name="chart" />
            득표 현황
          </h2>
          <span className="subtle-label">득표수 순</span>
        </div>
        {data.length === 0 ? (
          <EmptyState icon="ballot" title="함께할 후보자를 기다리고 있어요">
            관리 화면에서 후보자를 등록하면 집계가 시작됩니다.
          </EmptyState>
        ) : (
          <div className="result-rows">
            <AnimatePresence initial={false}>
              {data.map((row, index) => (
                <motion.div
                  className="result-row"
                  key={row.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.25 }}
                >
                  <span className={`rank ${index === 0 && row.votes > 0 ? 'rank-first' : ''}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <strong className="result-name" title={row.name}>
                    {row.name}
                  </strong>
                  <div className="bar-track" aria-hidden="true">
                    <motion.div
                      className="bar-fill"
                      initial={false}
                      animate={{ width: `${(row.votes / maxVotes) * 100}%` }}
                      style={{ backgroundColor: row.color }}
                      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="result-count">
                    <strong>
                      {row.votes.toLocaleString()}
                      <small>표</small>
                    </strong>
                    <span>{totalVotes ? ((row.votes / totalVotes) * 100).toFixed(1) : '0.0'}%</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
      <section className="result-winners" aria-labelledby="winners-heading">
        <div className="section-label">
          <Icon name="award" />
          <h2 id="winners-heading">당선자</h2>
          <span>
            {winners.some((person) => person.confirmed)
              ? '선택의 주인공, 당선을 축하합니다'
              : '당선 확정을 기다리고 있어요'}
          </span>
        </div>
        <div
          className="winner-cards"
          tabIndex={winners.length > 0 ? 0 : undefined}
          role="region"
          aria-label="당선자 목록"
        >
          {winners.length === 0 ? (
            <p className="winner-placeholder">당선자 설정 창에서 이름과 직위를 등록해 주세요.</p>
          ) : (
            winners.map((person, index) => (
              <div
                key={index}
                className={`winner-card ${person.confirmed ? 'winner-card-confirmed' : ''}`}
              >
                <span className="winner-medal">
                  <Icon name="award" />
                </span>
                <div>
                  <span title={person.position}>{person.position}</span>
                  <strong title={person.name}>{person.name}</strong>
                </div>
                {person.confirmed ? (
                  <span className="winner-confirmed-label">
                    <Icon className="winner-check" name="check" />
                    확정
                  </span>
                ) : (
                  <span className="winner-pending-label">확정 대기</span>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      <footer className="result-footer">
        함께해 주신 모든 분의 한 표에 감사합니다.<span>YEONGDU ELECTION</span>
      </footer>
      {celebration && (
        <WinnerCelebration
          key={celebration.id}
          winner={celebration.winner}
          onClose={closeCelebration}
        />
      )}
    </div>
  )
}
