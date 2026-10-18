import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Brand } from './components/ui'
import Candidate from './page/candidate'
import StartPage from './page/start'
import TitlePage from './page/title'
import WinnerPage from './page/winner'
import { ElectionPage } from './page/election'

function App(): React.JSX.Element {
  const { pathname } = useLocation()
  const isResult = pathname === '/election'
  const isDialog = pathname === '/title' || pathname === '/winner'

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`app-shell ${isResult ? 'result-shell' : ''} ${isDialog ? 'dialog-shell' : ''}`}
      >
        {!isResult && (
          <header className="app-header">
            <Brand />
            <span className="header-note">모두의 한 표가 모이는 곳</span>
          </header>
        )}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/title" element={<TitlePage />} />
            <Route path="/candidate" element={<Candidate />} />
            <Route path="/winner" element={<WinnerPage />} />
            <Route path="/election" element={<ElectionPage />} />
          </Routes>
        </main>
      </div>
    </MotionConfig>
  )
}

export default App
