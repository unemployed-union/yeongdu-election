import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  angle: number
  spin: number
  color: string
}

const colors = ['#548b67', '#c6a358', '#e6c777', '#91b9b3', '#cc8d91', '#a9c08b']

export function Confetti(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let frame = 0
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let start = 0
    let previous = 0

    function resize(): void {
      if (!canvas || !context) return
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles = Array.from({ length: 170 }, (_, index) => {
        const left = index % 2 === 0
        return {
          x: width * (left ? 0.12 : 0.88),
          y: height * 0.7,
          vx: (left ? 1 : -1) * (2 + Math.random() * 7) * Math.min(width / 800, 1.5),
          vy: -(9 + Math.random() * 10),
          size: 4 + Math.random() * 6,
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.2,
          color: colors[index % colors.length]
        }
      })
    }

    function draw(time: number): void {
      if (!context) return
      if (!start) start = time
      const elapsed = time - start
      const step = previous ? Math.min((time - previous) / 16.67, 2) : 1
      previous = time
      context.clearRect(0, 0, width, height)
      context.globalAlpha = Math.min(1, Math.max(0, (5500 - elapsed) / 1200))

      for (const particle of particles) {
        particle.vy += 0.17 * step
        particle.vx *= Math.pow(0.995, step)
        particle.x += particle.vx * step
        particle.y += particle.vy * step
        particle.angle += particle.spin * step
        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.angle)
        context.fillStyle = particle.color
        context.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size * 0.55
        )
        context.restore()
      }

      if (elapsed < 5500) frame = requestAnimationFrame(draw)
      else context.clearRect(0, 0, width, height)
    }

    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      context.clearRect(0, 0, width, height)
    }
  }, [])

  return <canvas ref={canvasRef} className="celebration-confetti" aria-hidden="true" />
}
