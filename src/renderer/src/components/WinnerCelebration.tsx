import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Winner } from '../../../shared/election'
import { Confetti } from './Confetti'
import { Icon } from './ui'

export function WinnerCelebration({
  winner,
  onClose
}: {
  winner: Winner
  onClose: () => void
}): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    const timer = window.setTimeout(onClose, 9000)
    return () => {
      window.clearTimeout(timer)
      dialog?.close()
    }
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      className="celebration-dialog"
      aria-labelledby="celebration-heading"
      aria-describedby="celebration-description"
      onCancel={onClose}
    >
      {!reducedMotion && <Confetti />}
      <div className="celebration-card">
        <span className="celebration-medal">
          <Icon name="award" />
        </span>
        <span className="eyebrow">A NEW BEGINNING</span>
        <span className="celebration-position">{winner.position} 당선</span>
        <h2 id="celebration-heading">
          <strong>{winner.name}</strong> 님,
          <br />
          당선을 축하합니다!
        </h2>
        <p id="celebration-description">
          모두의 선택으로 만들어진 새로운 시작.
          <br />
          앞으로의 빛나는 걸음을 응원합니다.
        </p>
        <button autoFocus className="button button-primary" onClick={onClose}>
          <Icon name="check" />
          함께 축하해 주세요
        </button>
        <span className="celebration-hint">잠시 후 결과 화면으로 돌아갑니다.</span>
      </div>
    </dialog>
  )
}
