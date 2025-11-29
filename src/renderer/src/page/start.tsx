import { useNavigate } from 'react-router-dom'

function StartPage(): React.JSX.Element {
  const navigate = useNavigate()

  const handleStartClick = (): void => {
    navigate('/candidate')
  }

  return (
    <>
      <span className="text-3xl font-bold">Yeongdu Election에 오신 것을 환영합니다.</span>
      <p>학교나 교회에서 임원 선출을 할 때 사용되길 기대하며 만든 프로젝트입니다.</p>
      <br />
      <p>아래 버튼을 눌러 시작하세요!</p>
      <br />
      <button
        className="text-xl text-white p-3 rounded-xl bg-blue-500"
        type="button"
        onClick={() => handleStartClick()}
      >
        시작
      </button>
      <br />
    </>
  )
}

export default StartPage
