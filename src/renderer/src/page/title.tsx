import { useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../components/ui'
import { useElectionTitle } from '../hooks/useElection'
import { useAsyncAction } from '../hooks/useAsyncAction'

export function TitlePage(): React.JSX.Element {
  const currentTitle = useElectionTitle()
  const [draft, setDraft] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const { pending, error, run } = useAsyncAction()
  const title = draft ?? currentTitle

  async function save(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (pending) return
    setSaved(false)
    if (await run(() => window.api.setElectionTitle(title))) setSaved(true)
  }

  return (
    <div className="dialog-page">
      <div className="page-heading">
        <span className="eyebrow">MAKE IT YOURS</span>
        <h1>투표 제목 설정</h1>
        <p>이번 투표를 소개하는 이름을 정해 주세요.</p>
      </div>
      <form className="panel title-form" onSubmit={save}>
        <label className="field-label" htmlFor="election-title">
          투표 제목
        </label>
        <input
          id="election-title"
          autoFocus
          placeholder="예: 2026 우리 모임 대표 선거"
          value={title}
          onChange={(event) => {
            setDraft(event.target.value)
            setSaved(false)
          }}
          aria-describedby="title-help"
        />
        <p id="title-help" className="field-hint">
          결과 화면 상단에 표시됩니다. 비워 두면 기본 제목을 사용해요.
        </p>
        <div className="title-form-footer">
          <span className="save-status" role="status">
            {saved && (
              <>
                <Icon name="check" />
                제목을 저장했어요
              </>
            )}
          </span>
          <button type="submit" className="button button-primary" disabled={pending}>
            <Icon name="check" />
            {pending ? '저장 중…' : '제목 저장'}
          </button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

export default TitlePage
