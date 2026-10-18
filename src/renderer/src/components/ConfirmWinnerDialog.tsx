import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Winner } from '../../../shared/election'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { Icon } from './ui'

export function ConfirmWinnerDialog({
  name,
  winners,
  onClose,
  onConfirmed
}: {
  name: string
  winners: Winner[]
  onClose: () => void
  onConfirmed: () => void
}): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [position, setPosition] = useState(
    () => winners.find((person) => person.name === name && !person.confirmed)?.position ?? ''
  )
  const { pending, error, run } = useAsyncAction()
  const registered = winners.find(
    (person) => person.name === name && person.position === position.trim()
  )

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  async function confirm(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (pending || !position.trim() || registered?.confirmed) return
    if (
      await run(async () => {
        const person = { name, position: position.trim() }
        if (!registered) await window.api.addWinner(person)
        await window.api.confirmWinner(person)
      })
    )
      onConfirmed()
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-winner-dialog"
      aria-labelledby="confirm-winner-heading"
      onCancel={(event) => {
        event.preventDefault()
        if (!pending) onClose()
      }}
    >
      <form onSubmit={confirm}>
        <span className="eyebrow">CELEBRATE THE CHOICE</span>
        <h2 id="confirm-winner-heading">당선 확정</h2>
        <p>
          <strong>{name}</strong> 님이 맡을 직위를 확인해 주세요.
          <br />
          확정하면 결과 창에 축하 메시지와 컨페티가 표시됩니다.
        </p>
        <label className="field-label" htmlFor="confirm-winner-position">
          직위
        </label>
        <input
          id="confirm-winner-position"
          autoFocus
          autoComplete="off"
          list="registered-winner-positions"
          placeholder="예: 회장"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          disabled={pending}
        />
        <datalist id="registered-winner-positions">
          {[
            ...new Set(
              winners.filter((person) => person.name === name).map((person) => person.position)
            )
          ].map((value) => (
            <option key={value} value={value} />
          ))}
        </datalist>
        {registered?.confirmed && <p className="field-hint">이미 당선이 확정된 직위입니다.</p>}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="confirm-winner-actions">
          <button
            className="button button-secondary"
            type="button"
            disabled={pending}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="button button-primary"
            type="submit"
            disabled={pending || !position.trim() || registered?.confirmed}
          >
            <Icon name="check" />
            {pending ? '확정 중…' : '당선 확정'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
