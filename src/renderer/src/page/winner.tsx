import { useEffect, useState } from 'react'

export function WinnerPage(): React.JSX.Element {
  const [winner, setWinner] = useState<Record<string, string>[]>([])

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    const newWinner = { ...winner, name: e.target.value }
    setWinner(newWinner)
  }

  function onChangePosition(e: React.ChangeEvent<HTMLInputElement>): void {
    const newWinner = { ...winner, position: e.target.value }
    setWinner(newWinner)
  }

  useEffect(() => {
    window.api.getWinner().then((data) => {
      setWinner(data)
    })

    const unsubscribe = window.api.onWinnerUpdated((data) => {
      setWinner(data)
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return (
    <div className="h-full w-full flex flex-col">
      <span className="text-3xl font-bold">당선자 페이지</span>
      <p>여기에 당선자 관련 내용을 추가하세요.</p>
      <hr className="mt-4 mb-4 border-gray-400" />
      <div className="flex flex-row width-full">
        <div className="flex-2">이름</div>
        <div className="flex-2">직위</div>
      </div>
      <div className="w-full flex flex-row">
        <div className="w-full flex flex-row gap-2">
          <input
            className="flex-4 p-2 mt-2 mb-2 border border-gray-300 rounded"
            placeholder="이름"
            onChange={onChangeName}
          ></input>
          <input
            className="flex-4 p-2 mt-2 mb-2 border border-gray-300 rounded"
            placeholder="직위"
            onChange={onChangePosition}
          ></input>
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => window.api.setWinner(winner)}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}

export default WinnerPage
