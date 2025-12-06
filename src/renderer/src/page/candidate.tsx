import { useEffect, useState } from 'react'

function Candidate(): React.JSX.Element {
  const [candidate, setCandidate] = useState<string>('')
  const [candidates, setCandidates] = useState<Record<string, number>>({})

  const changeCandidate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCandidate(e.target.value)
  }

  useEffect(() => {
    window.api.getCandidate().then((votes) => {
      setCandidates(votes)
    })

    // ② 메인에서 오는 "vote-updated" 이벤트 구독
    const unsubscribe = window.api.onVoteUpdated((votes) => {
      setCandidates(votes)
    })

    // ③ 언마운트 시 구독 해제
    return () => {
      unsubscribe?.()
    }
  }, [])

  return (
    <div className="h-full w-full flex flex-col">
      <span className="text-3xl font-bold">후보자 페이지</span>
      <p>여기에 후보자 관련 내용을 추가하세요.</p>
      <div className="width-full">
        <hr className="mt-4 mb-4 border-gray-400" />
        {/* 후보자 목록이나 기타 내용이 여기에 들어갑니다. */}
        <div className="flex flex-row width-full">
          <div className="w-50 text-center text-xl">이름</div>
          <div className="w-full text-center text-xl">득표</div>
          <div className="flex flex-row gap-2">
            <button className="mt-1 mb-1 w-20 p-1"></button>
            <button className="mt-1 mb-1 p-1 w-7"></button>
            <button className="mt-1 mb-1 p-1 w-7"></button>
          </div>
        </div>
        <div className="flex flex-col width-full">
          {Object.entries(candidates).map(([name, votes]) => (
            <div key={name} className="flex flex-row width-full">
              <div className="flex flex-row justify-between w-full">
                <div className="w-50 flex justify-center items-center font-bold text-2xl">
                  {name}
                </div>
                <div className="w-full flex justify-center items-center font-bold text-2xl">
                  {votes}
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    className="mt-1 mb-1 w-20 p-1 bg-red-500 text-white rounded"
                    onClick={() => window.api.removeCandidate(name)}
                  >
                    삭제
                  </button>
                  <button
                    className="mt-1 mb-1 p-1 w-7 bg-yellow-500 text-white rounded"
                    onClick={() => window.api.removeVote(name)}
                  >
                    -
                  </button>
                  <button
                    className="mt-1 mb-1 p-1 w-7 bg-green-500 text-white rounded"
                    onClick={() => window.api.vote(name)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-2">
          <input
            className="flex-4 p-2 mt-2 mb-2 border border-gray-300 rounded"
            placeholder="이름"
            value={candidate}
            onChange={changeCandidate}
          ></input>
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              window.api.vote(candidate)
              setCandidate('')
            }}
          >
            후보자 추가
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              window.api.openWinnerWindow()
            }}
          >
            당선자 설정
          </button>
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              window.api.openSubWindow()
            }}
          >
            투표 제목 설정
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-green-500 text-white rounded"
            onClick={() => window.api.openElectionWindow()}
          >
            시작
          </button>
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-red-500 text-white rounded"
            onClick={() => {
              window.api.removeAllCandidate()
              window.api.setElectionTitle('')
            }}
          >
            후보자 및 제목 초기화
          </button>
        </div>
      </div>
    </div>
  )
}

export default Candidate
