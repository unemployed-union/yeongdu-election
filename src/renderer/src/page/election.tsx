import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type VoteData = {
  id: string
  name: string
  votes: number
  color: string
}

const baseColors = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F']

export function ElectionPage(): React.JSX.Element {
  const [data, setData] = useState<VoteData[]>([])
  const [winner, setWinner] = useState<Record<string, string>[]>([])
  const [title, setTitle] = useState<string>('')

  // 🔥 후보별로 색을 기억하는 맵: id -> color
  const colorMapRef = useRef<Record<string, string>>({})
  const nextColorIndexRef = useRef(0)

  // id에 대응되는 색을 가져오거나 새로 할당
  const getColorForId = (id: string): string => {
    const map = colorMapRef.current
    if (!map[id]) {
      const color = baseColors[nextColorIndexRef.current % baseColors.length]
      map[id] = color
      nextColorIndexRef.current += 1
    }
    return map[id]
  }

  // 🔥 Record<string, number> → 정렬된 배열 + 색 정보까지 포함
  const transform = (votes: Record<string, number>): VoteData[] =>
    Object.entries(votes)
      .map(([id, count]) => ({
        id,
        name: id.toUpperCase(),
        votes: count,
        color: getColorForId(id) // ← 여기서 후보별 고정 색 할당
      }))
      .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name))

  useEffect(() => {
    // ① 초기 로딩 시 현재 투표 결과 가져오기
    window.api.getCandidate().then((votes) => {
      setData(transform(votes))
    })
    window.api.getWinner().then((data) => {
      setWinner(data)
    })
    window.api.getElectionTitle().then((title) => {
      setTitle(title)
    })

    // ② 메인에서 오는 "vote-updated" 이벤트 구독
    const unsubscribeVote = window.api.onVoteUpdated((votes) => {
      setData(transform(votes))
    })
    const unsubscribeWinner = window.api.onWinnerUpdated((data) => {
      setWinner(data)
    })
    const unsubscribeTitle = window.api.onTitleUpdated((title) => {
      setTitle(title)
    })

    return () => {
      unsubscribeVote?.()
      unsubscribeWinner?.()
      unsubscribeTitle?.()
    }
  }, [])

  // 최대 득표수: 막대 길이 비율 계산용
  const maxVotes = useMemo(() => Math.max(...data.map((d) => d.votes), 1), [data])

  const Winners = (): React.JSX.Element[] => {
    if (Object.keys(winner).length === 0) {
      return []
    }

    return winner.map((object: Record<string, string>, idx: number) => (
      <div key={idx} className="bg-gray-200 rounded-xl p-4">
        <span className="font-bold text-2xl">{object.position}</span>
        <br />
        <span className="font-bold text-4xl">{object.name}</span>
      </div>
    ))
  }

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
              layout // 🔥 순위가 바뀌면 위/아래 위치가 부드럽게 이동
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
                  layout // 🔥 득표수가 바뀌면 길이도 부드럽게 변함
                  style={{
                    height: '100%',
                    borderRadius: 12,
                    width: `${widthPercent}%`,
                    background: row.color // ← index 대신 후보 고유 색
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
          <Winners />
        </div>
      </div>
    </div>
  )
}
