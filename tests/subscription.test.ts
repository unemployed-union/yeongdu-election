import { deepStrictEqual, equal } from 'node:assert/strict'
import { test } from 'node:test'
import { subscribeToValue } from '../src/renderer/src/lib/subscription'

interface TestSource {
  resolve: (value: string) => void
  reject: (error: unknown) => void
  emit: (value: string) => void
  unsubscribe: () => void
  values: string[]
  errors: unknown[]
  readonly unsubscribeCount: number
}

function createSource(): TestSource {
  let resolve!: (value: string) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<string>((onResolve, onReject) => {
    resolve = onResolve
    reject = onReject
  })
  let listener: (value: string) => void = () => {}
  let unsubscribeCount = 0
  const values: string[] = []
  const errors: unknown[] = []

  const unsubscribe = subscribeToValue(
    () => promise,
    (callback) => {
      listener = callback
      return () => {
        unsubscribeCount += 1
      }
    },
    (value) => values.push(value),
    (error) => errors.push(error)
  )

  return {
    resolve,
    reject,
    emit: (value: string) => listener(value),
    unsubscribe,
    values,
    errors,
    get unsubscribeCount() {
      return unsubscribeCount
    }
  }
}

test('initial data loads and subsequent events update it', async () => {
  const source = createSource()
  source.resolve('initial')
  await Promise.resolve()
  source.emit('updated')
  deepStrictEqual(source.values, ['initial', 'updated'])
  source.unsubscribe()
  equal(source.unsubscribeCount, 1)
})

test('a delayed initial response cannot overwrite a newer event', async () => {
  const source = createSource()
  source.emit('updated')
  source.resolve('stale')
  await Promise.resolve()
  deepStrictEqual(source.values, ['updated'])
  source.unsubscribe()
})

test('a synchronous event during subscription also takes precedence over initial data', async () => {
  const values: string[] = []
  const unsubscribe = subscribeToValue(
    () => Promise.resolve('stale'),
    (callback) => {
      callback('updated')
      return () => {}
    },
    (value) => values.push(value),
    () => {}
  )
  await Promise.resolve()
  deepStrictEqual(values, ['updated'])
  unsubscribe()
})

test('cleanup ignores pending initial data and late events', async () => {
  const source = createSource()
  source.unsubscribe()
  source.resolve('initial')
  source.emit('late event')
  await Promise.resolve()
  deepStrictEqual(source.values, [])
  equal(source.unsubscribeCount, 1)
})

test('an initial request failure is reported and later events can recover', async () => {
  const source = createSource()
  const error = new Error('Request failed')
  source.reject(error)
  await Promise.resolve()
  deepStrictEqual(source.errors, [error])
  source.emit('recovered')
  deepStrictEqual(source.values, ['recovered'])
  source.unsubscribe()
})

test('request failures after an event or cleanup do not report stale errors', async () => {
  const updated = createSource()
  updated.emit('updated')
  updated.reject(new Error('Stale failure'))
  const disposed = createSource()
  disposed.unsubscribe()
  disposed.reject(new Error('Late failure'))
  await Promise.resolve()
  deepStrictEqual(updated.errors, [])
  deepStrictEqual(disposed.errors, [])
  updated.unsubscribe()
})

test('a disposed subscription cannot interfere with a replacement subscription', async () => {
  const first = createSource()
  first.unsubscribe()
  const second = createSource()
  first.resolve('stale mount')
  second.resolve('current mount')
  await Promise.resolve()
  deepStrictEqual(first.values, [])
  deepStrictEqual(second.values, ['current mount'])
  second.unsubscribe()
})
