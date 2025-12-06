import { useState } from 'react'

export function TitlePage(): React.JSX.Element {
  const [title, setTitle] = useState<string>('')

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value)
  }

  return (
    <div className="h-full w-full flex flex-col">
      <span className="text-3xl font-bold">투표 제목 설정 페이지</span>
      <p>여기에 투표 제목 관련 내용을 추가하세요.</p>
      <hr className="mt-4 mb-4 border-gray-400" />
      <div className="w-full flex flex-row">
        <div className="w-full flex flex-row gap-2">
          <input
            className="flex-4 p-2 mt-2 mb-2 border border-gray-300 rounded"
            placeholder="투표 제목을 입력하세요"
            value={title}
            onChange={changeTitle}
          ></input>
          <button
            className="flex-1 mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => window.api.setElectionTitle(title)}
          >
            제목 설정
          </button>
        </div>
      </div>
    </div>
  )
}

export default TitlePage
