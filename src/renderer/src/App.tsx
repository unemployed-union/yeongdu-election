import { Route, Routes } from 'react-router-dom'
import Candidate from './page/candidate'
import StartPage from './page/start'
import TitlePage from './page/title'
import WinnerPage from './page/winner'
import { ElectionPage } from './page/election'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="flex h-full p-9 flex-col items-center justify-center gap-4">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/title" element={<TitlePage />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/winner" element={<WinnerPage />} />
        <Route path="/election" element={<ElectionPage />} />
      </Routes>
    </div>
  )
}

export default App
