import { useState } from 'react'
import type { FormEvent } from 'react'
import { EmptyState, Icon } from '../components/ui'
import { ConfirmWinnerDialog } from '../components/ConfirmWinnerDialog'
import { useCandidates, useElectionTitle, useWinners } from '../hooks/useElection'
import { useAsyncAction } from '../hooks/useAsyncAction'

function Candidate(): React.JSX.Element {
  const [candidate, setCandidate] = useState('')
  const [confirmingName, setConfirmingName] = useState<string | null>(null)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const candidates = useCandidates()
  const title = useElectionTitle()
  const winners = useWinners()
  const { pending, error, run } = useAsyncAction()
  const entries = Object.entries(candidates)
  const totalVotes = entries.reduce((total, [, votes]) => total + votes, 0)
  const duplicate = Object.hasOwn(candidates, candidate.trim())

  async function addCandidate(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (pending || !candidate.trim() || duplicate) return
    if (await run(() => window.api.addCandidate(candidate.trim()))) setCandidate('')
  }

  async function resetCandidates(): Promise<void> {
    if (pending || entries.length === 0) return
    if (await run(() => window.api.removeAllCandidate())) {
      setCandidate('')
      setConfirmingName(null)
      setConfirmationMessage('후보자를 초기화했습니다. 당선자 목록은 유지됩니다.')
    }
  }

  return (
    <div className="workspace-page">
      <div className="page-heading workspace-heading">
        <div>
          <span className="eyebrow">ELECTION WORKSPACE</span>
          <h1>투표 관리</h1>
          <p>후보자를 준비하고, 모이는 한 표를 기록해 주세요.</p>
        </div>
        <button className="button button-primary" onClick={() => window.api.openElectionWindow()}>
          결과 화면 열기
          <Icon name="external" />
        </button>
      </div>
      <div className="workspace-grid">
        <section className="panel candidate-panel" aria-labelledby="candidate-heading">
          <div className="panel-heading">
            <h2 id="candidate-heading">
              후보자<span className="count-badge">{entries.length}</span>
            </h2>
            <button
              className="button candidate-reset-button"
              disabled={pending || entries.length === 0}
              title="후보자와 득표만 초기화합니다. 당선자와 투표 제목은 유지됩니다."
              onClick={resetCandidates}
            >
              <Icon name="reset" />
              후보자 초기화
            </button>
          </div>
          <div className="candidate-table-head">
            <span>이름</span>
            <span>득표 조정</span>
            <span>당선</span>
            <span className="sr-only">삭제</span>
          </div>
          <div className="candidate-list">
            {entries.length === 0 ? (
              <EmptyState icon="users" title="첫 후보자를 기다리고 있어요">
                아래에서 이름을 입력해 시작해 주세요.
              </EmptyState>
            ) : (
              entries.map(([name, votes], index) => {
                const registered = winners.filter((person) => person.name === name)
                const confirmed =
                  registered.length > 0 && registered.every((person) => person.confirmed)
                return (
                  <div key={name} className="candidate-row">
                    <div className="person">
                      <span className={`avatar avatar-${index % 4}`} aria-hidden="true">
                        {name.slice(0, 1)}
                      </span>
                      <span className="person-name" title={name}>
                        {name}
                      </span>
                    </div>
                    <div className="vote-stepper">
                      <button
                        className="stepper-button"
                        disabled={votes === 0}
                        aria-label={`${name} 1표 감소`}
                        onClick={() => window.api.removeVote(name)}
                      >
                        <Icon name="minus" />
                      </button>
                      <span className="vote-count" aria-label={`${votes}표`}>
                        {votes}
                      </span>
                      <button
                        className="stepper-button stepper-add"
                        aria-label={`${name} 1표 추가`}
                        onClick={() => window.api.vote(name)}
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                    <button
                      className={`button winner-confirm-button ${confirmed ? 'button-confirmed' : 'button-primary'}`}
                      disabled={confirmed}
                      aria-label={`${name} ${confirmed ? '확정됨' : '당선 확정'}`}
                      onClick={() => setConfirmingName(name)}
                    >
                      <Icon name="check" />
                      {confirmed ? '확정됨' : '당선 확정'}
                    </button>
                    <button
                      className="icon-button delete-button"
                      aria-label={`${name} 후보자 삭제`}
                      title="후보자 삭제"
                      onClick={() => window.api.removeCandidate(name)}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
          <form className="candidate-form" onSubmit={addCandidate}>
            <label className="sr-only" htmlFor="candidate-name">
              후보자 이름
            </label>
            <div className="input-action">
              <input
                id="candidate-name"
                autoComplete="off"
                placeholder="후보자 이름을 입력하세요"
                value={candidate}
                onChange={(event) => setCandidate(event.target.value)}
                aria-describedby="candidate-help"
                aria-invalid={duplicate}
              />
              <button
                className="button button-primary"
                disabled={pending || !candidate.trim() || duplicate}
                type="submit"
              >
                <Icon name="plus" />
                {pending ? '추가 중' : '추가'}
              </button>
            </div>
            <p id="candidate-help" className={`field-hint ${duplicate ? 'text-danger' : ''}`}>
              {duplicate ? '이미 등록된 후보자예요.' : '새 후보자는 0표로 등록됩니다.'}
            </p>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </form>
        </section>
        <aside className="settings-column" aria-label="투표 설정">
          <section className="panel settings-panel">
            <h2>투표 설정</h2>
            <button className="setting-link" onClick={() => window.api.openSubWindow()}>
              <span className="setting-icon">
                <Icon name="title" />
              </span>
              <span className="setting-copy">
                <strong>투표 제목</strong>
                <span title={title}>{title || '제목을 설정해 주세요'}</span>
              </span>
              <Icon name="external" />
            </button>
            <button className="setting-link" onClick={() => window.api.openWinnerWindow()}>
              <span className="setting-icon">
                <Icon name="award" />
              </span>
              <span className="setting-copy">
                <strong>당선자 설정</strong>
                <span>
                  {winners.length
                    ? `${winners.length}명의 당선자가 등록되어 있어요`
                    : '당선자와 직위를 등록하세요'}
                </span>
              </span>
              <Icon name="external" />
            </button>
          </section>
          <section className="summary-panel" aria-label="집계 현황">
            <span className="eyebrow">지금까지 모인 선택</span>
            <div className="summary-number">
              {totalVotes.toLocaleString()}
              <span>표</span>
            </div>
            <p>
              <span className="status-dot" />
              {entries.length}명의 후보자가 함께하고 있어요
            </p>
          </section>
          <p className="workspace-tip">
            <Icon name="chart" />
            결과 화면을 별도 창으로 열어
            <br />
            참여자들과 함께 확인해 보세요.
          </p>
        </aside>
      </div>
      <footer className="workspace-footer">
        <span role="status">
          <span className="status-dot" />
          {confirmationMessage || '변경 사항은 결과 화면에 바로 반영됩니다.'}
        </span>
      </footer>
      {confirmingName !== null && (
        <ConfirmWinnerDialog
          name={confirmingName}
          winners={winners}
          onClose={() => setConfirmingName(null)}
          onConfirmed={() => {
            setConfirmationMessage(`${confirmingName} 님의 당선이 확정되었습니다.`)
            setConfirmingName(null)
          }}
        />
      )}
    </div>
  )
}

export default Candidate
