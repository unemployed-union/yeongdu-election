import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Candidate } from '../../../shared/election'
import { useCandidates, useElectionTitle, useWinners } from '../hooks/useElection'

interface VoteData extends Candidate {
  id: string
  color: string
}

const baseColors = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F']

export function ElectionPage(): React.JSX.Element {
  const [data, setData] = useState<VoteData[]>([])
  const candidates = useCandidates()
  const winner = useWinners()
  const title = useElectionTitle()

  const colorMapRef = useRef(new Map<string, string>())

  useEffect(() => {
    const colors = colorMapRef.current
    const rows = Object.entries(candidates)
      .map(([id, count]) => ({
        id,
        name: id.toUpperCase(),
        votes: count,
        color: getColor(id)
      }))
      .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name))

    function getColor(id: string): string {
      let color = colors.get(id)
      if (color === undefined) {
        color = baseColors[colors.size % baseColors.length]
        colors.set(id, color)
      }
      return color
    }

    setData(rows)
  }, [candidates])

  // 최대 득표수: 막대 길이 비율 계산용
  const maxVotes = useMemo(() => Math.max(...data.map((d) => d.votes), 1), [data])

  return (
    <div className="w-full h-full p-8">
      <span className="font-bold text-3xl pb-3">{title}</span>

      <div className="flex flex-col gap-4 mt-4">
        {data.map((row, index) => {
          const widthPercent = (row.votes / maxVotes) * 100

          return (
            <motion.div
              className="flex items-center"
              key={row.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {/* 순위 번호 */}
              <div className="w-3 text-right font-bold">{index + 1}</div>

              {/* 후보 이름 */}
              <div className="w-25 text-xl font-bold text-center">{row.name}</div>

              {/* 전체 바 영역 */}
              <div className="bg-gray-200 flex-1 h-10 rounded-2xl overflow-hidden">
                {/* 실제 채워지는 막대 */}
                <motion.div
                  layout
                  style={{
                    height: '100%',
                    borderRadius: 12,
                    width: `${widthPercent}%`,
                    background: row.color
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              </div>

              {/* 득표수 텍스트 */}
              <div
                style={{
                  width: 40,
                  textAlign: 'right',
                  fontWeight: 'bold'
                }}
              >
                {row.votes}
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="absolute bottom-18">
        <span className="text-2xl font-bold mt-4">당선자</span>
        <div className="mt-2 flex flex-row gap-2">
          {winner.map((person, index) => (
            <div key={index} className="bg-gray-200 rounded-xl p-4">
              <span className="font-bold text-2xl">{person.position}</span>
              <br />
              <span className="font-bold text-4xl">{person.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
