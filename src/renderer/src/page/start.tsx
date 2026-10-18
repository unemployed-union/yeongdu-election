import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/ui'

function StartPage(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="welcome-page">
      <section className="welcome-hero">
        <div className="welcome-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            작은 모임부터, 함께하는 선택까지
          </span>
          <h1>
            한 표, 한 표를 모아
            <br />
            <span>함께 만드는 선택.</span>
          </h1>
          <p>
            학교에서도, 교회에서도, 우리 모임 어디서나.
            <br />
            복잡한 준비 없이 투표를 진행해 보세요.
          </p>
          <button
            className="button button-primary button-large"
            onClick={() => navigate('/candidate')}
          >
            투표 준비하기
            <Icon name="arrow" />
          </button>
          <span className="welcome-caption">후보자 등록부터 결과 발표까지, 한곳에서.</span>
        </div>
        <div className="ballot-art" aria-hidden="true">
          <div className="art-orbit" />
          <svg
            className="ballot-drawing"
            width="280"
            height="280"
            viewBox="0 0 280 280"
            fill="none"
          >
            <ellipse cx="147" cy="242" rx="89" ry="13" fill="#dce6dd" />
            <path
              d="m49 144 91-38 91 38-90 39-92-39Z"
              fill="#e1ebe2"
              stroke="#b3c9b9"
              strokeWidth="1.5"
            />
            <path
              d="M49 144v75l92 32v-68l-92-39Z"
              fill="#f9fcf8"
              stroke="#b3c9b9"
              strokeWidth="1.5"
            />
            <path
              d="M141 183v68l90-35v-72l-90 39Z"
              fill="#c4dac9"
              stroke="#a3bea9"
              strokeWidth="1.5"
            />
            <path d="m103 145 46-18 28 12-46 19-28-13Z" fill="#36624c" />
            <g transform="rotate(-13 141 94)">
              <rect
                x="103"
                y="30"
                width="73"
                height="104"
                rx="7"
                fill="#fff"
                stroke="#a5c0ac"
                strokeWidth="1.5"
              />
              <rect x="116" y="47" width="47" height="4" rx="2" fill="#dbe6dd" />
              <rect x="116" y="58" width="29" height="4" rx="2" fill="#dbe6dd" />
              <rect x="121" y="78" width="29" height="29" rx="6" fill="#e6f0e7" />
              <path
                d="m128 92 6 6 10-12"
                stroke="#367359"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <path d="m77 174 36 14" stroke="#d5e3d7" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="art-label art-label-top">
            <span className="mini-check">
              <Icon name="check" />
            </span>
            모두의 한 표를 소중하게
          </span>
          <span className="art-label art-label-bottom">
            <Icon name="chart" />
            결과는 실시간으로
          </span>
          <span className="art-spark art-spark-one">+</span>
          <span className="art-spark art-spark-two">+</span>
        </div>
      </section>
      <section className="welcome-steps" aria-label="투표 진행 순서">
        <div>
          <span className="step-number">01</span>
          <div>
            <h2>후보자 등록</h2>
            <p>함께할 후보자를 추가해요.</p>
          </div>
        </div>
        <div>
          <span className="step-number">02</span>
          <div>
            <h2>투표 집계</h2>
            <p>한 표씩 간편하게 기록해요.</p>
          </div>
        </div>
        <div>
          <span className="step-number">03</span>
          <div>
            <h2>결과 발표</h2>
            <p>실시간 결과를 함께 확인해요.</p>
          </div>
        </div>
      </section>
      <p className="welcome-footer">A LITTLE VOTE. A SHARED FUTURE.</p>
    </div>
  )
}

export default StartPage
