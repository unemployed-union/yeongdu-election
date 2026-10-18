import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Winner } from '../../../shared/election'
import { EmptyState, Icon } from '../components/ui'
import { useWinners } from '../hooks/useElection'
import { useAsyncAction } from '../hooks/useAsyncAction'

export function WinnerPage(): React.JSX.Element {
  const winners = useWinners()
  const [newWinner, setNewWinner] = useState<Winner>({ name: '', position: '' })
  const { pending, error, run } = useAsyncAction()

  function onChange(event: React.ChangeEvent<HTMLInputElement>, target: keyof Winner): void {
    const value = event.target.value
    setNewWinner((previous) => ({ ...previous, [target]: value }))
  }

  async function addWinner(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (pending || !newWinner.name.trim() || !newWinner.position.trim()) return
    if (
      await run(() =>
        window.api.addWinner({ name: newWinner.name.trim(), position: newWinner.position.trim() })
      )
    ) {
      setNewWinner({ name: '', position: '' })
    }
  }

  return (
    <div className="dialog-page">
      <div className="page-heading">
        <span className="eyebrow">CELEBRATE THE CHOICE</span>
        <h1>
          당선자 설정<span className="count-badge">{winners.length}</span>
        </h1>
        <p>이름과 직위를 관리하고, 투표 관리 화면에서 당선을 확정해 주세요.</p>
      </div>
      <section className="panel winner-panel" aria-label="당선자 목록">
        <div className="winner-list">
          {winners.length === 0 ? (
            <EmptyState compact icon="award" title="새로운 시작을 축하할 준비">
              당선자를 등록하면 결과 화면에 함께 표시됩니다.
            </EmptyState>
          ) : (
            winners.map((person, index) => (
              <div key={index} className="winner-row">
                <span className="winner-medal">
                  <Icon name="award" />
                </span>
                <strong title={person.name}>{person.name}</strong>
                <span className="position-tag" title={person.position}>
                  {person.position}
                </span>
                <span
                  className={person.confirmed ? 'winner-confirmed-label' : 'winner-pending-label'}
                >
                  {person.confirmed ? '확정됨' : '확정 대기'}
                </span>
                <button
                  className="icon-button delete-button"
                  aria-label={`${person.name} 당선자 삭제`}
                  title="당선자 삭제"
                  onClick={() => window.api.removeWinner(person.name)}
                >
                  <Icon name="trash" />
                </button>
              </div>
            ))
          )}
        </div>
        <form className="winner-form" onSubmit={addWinner}>
          <div className="field">
            <label className="field-label" htmlFor="winner-name">
              이름
            </label>
            <input
              id="winner-name"
              placeholder="당선자 이름"
              autoComplete="off"
              value={newWinner.name}
              onChange={(event) => onChange(event, 'name')}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="winner-position">
              직위
            </label>
            <input
              id="winner-position"
              placeholder="예: 회장"
              value={newWinner.position}
              onChange={(event) => onChange(event, 'position')}
            />
          </div>
          <button
            className="button button-primary"
            type="submit"
            disabled={pending || !newWinner.name.trim() || !newWinner.position.trim()}
          >
            <Icon name="plus" />
            {pending ? '추가 중' : '추가'}
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>
    </div>
  )
}

export default WinnerPage
