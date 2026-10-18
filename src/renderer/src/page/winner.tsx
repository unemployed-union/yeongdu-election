import { useState } from 'react'
import type { Winner } from '../../../shared/election'
import { useWinners } from '../hooks/useElection'

export function WinnerPage(): React.JSX.Element {
  const winner = useWinners()
  const [newWinner, setNewWinner] = useState<Winner>({ name: '', position: '' })

  function onChange(e: React.ChangeEvent<HTMLInputElement>, target: keyof Winner): void {
    setNewWinner((previous) => ({ ...previous, [target]: e.target.value }))
  }

  return (
    <div className="h-full w-full flex flex-col">
      <span className="text-3xl font-bold">당선자 페이지</span>
      <p>여기에 당선자 관련 내용을 추가하세요.</p>
      <hr className="mt-4 mb-4 border-gray-400" />
      <div className="flex flex-row width-full">
        <div className="flex-2 flex justify-center items-center">이름</div>
        <div className="flex-2 flex justify-center items-center">직위</div>
        <div className="w-20" />
      </div>
      {winner.map((person, index) => (
        <div key={index} className="flex flex-row width-full">
          <div className="flex justify-center items-center font-bold text-2xl flex-1">
            {person.name}
          </div>
          <div className="flex justify-center items-center font-bold text-2xl flex-1">
            {person.position}
          </div>
          <button
            className="mt-1 mb-1 w-20 p-1 bg-red-500 text-white rounded"
            onClick={() => window.api.removeWinner(person.name)}
          >
            삭제
          </button>
        </div>
      ))}
      <div className="w-full flex flex-row">
        <div className="w-full flex flex-row gap-2">
          <input
            className="flex-4 p-2 mt-2 mb-2 border border-gray-300 rounded"
            placeholder="이름"
            value={newWinner.name}
            onChange={(e) => onChange(e, 'name')}
          ></input>
          <input
            className="flex-4 p-2 mt-2 mb-2 border border-gray-300 rounded"
            placeholder="직위"
            value={newWinner.position}
            onChange={(e) => onChange(e, 'position')}
          ></input>
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              window.api.addWinner(newWinner)
              setNewWinner({ name: '', position: '' })
            }}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}

export default WinnerPage
