import { deepStrictEqual, equal } from 'node:assert/strict'
import { test } from 'node:test'
import { ElectionStore } from '../src/main/data'

test('a candidate starts at zero votes and duplicate registration preserves votes', () => {
  const store = new ElectionStore()
  deepStrictEqual(store.addCandidate(' Alice '), { Alice: 0 })
  store.vote('Alice')
  deepStrictEqual(store.addCandidate('Alice'), { Alice: 1 })
  deepStrictEqual(store.addCandidate('  '), { Alice: 1 })
})

test('votes can be added and removed but never become negative', () => {
  const store = new ElectionStore()
  store.addCandidate('Alice')
  store.vote('Alice')
  deepStrictEqual(store.vote('Alice'), { Alice: 2 })
  deepStrictEqual(store.removeVote('Alice'), { Alice: 1 })
  store.removeVote('Alice')
  deepStrictEqual(store.removeVote('Alice'), { Alice: 0 })
})

test('voting for a removed or unknown candidate does not recreate it', () => {
  const store = new ElectionStore()
  store.addCandidate('Alice')
  store.removeCandidate('Alice')
  deepStrictEqual(store.vote('Alice'), {})
  deepStrictEqual(store.removeVote('Bob'), {})
})

test('candidate names that match object properties remain ordinary candidates', () => {
  const store = new ElectionStore()
  for (const name of ['__proto__', 'constructor', 'toString']) {
    store.addCandidate(name)
    equal(store.vote(name)[name], 1)
    equal(store.removeVote(name)[name], 0)
    store.removeCandidate(name)
  }
  deepStrictEqual(store.getCandidates(), {})
})

test('returned candidate snapshots cannot mutate stored votes or change retroactively', () => {
  const store = new ElectionStore()
  const initial = store.addCandidate('Alice')
  initial.Alice = 100
  deepStrictEqual(store.getCandidates(), { Alice: 0 })
  const snapshot = store.getCandidates()
  store.vote('Alice')
  deepStrictEqual(snapshot, { Alice: 0 })
})

test('clearing candidates preserves the title and winners', () => {
  const store = new ElectionStore()
  store.setTitle('Election')
  store.addWinner({ name: 'Alice', position: 'Chair' })
  store.addCandidate('Alice')
  deepStrictEqual(store.removeAllCandidates(), {})
  equal(store.getTitle(), 'Election')
  deepStrictEqual(store.getWinners(), [{ name: 'Alice', position: 'Chair' }])
  equal(store.setTitle(''), '')
})

test('winners can be replaced, added and removed by name', () => {
  const store = new ElectionStore()
  store.setWinners([{ name: 'Alice', position: 'Chair' }])
  store.addWinner({ name: 'Bob', position: 'Secretary' })
  deepStrictEqual(store.removeWinner('Alice'), [{ name: 'Bob', position: 'Secretary' }])
  deepStrictEqual(store.setWinners([]), [])
})

test('winner inputs and returned snapshots cannot mutate stored winners', () => {
  const store = new ElectionStore()
  const winner = { name: 'Alice', position: 'Chair' }
  const input = [winner]
  const result = store.setWinners(input)
  winner.name = 'Changed input'
  input.push({ name: 'Bob', position: 'Secretary' })
  result[0].position = 'Changed output'
  deepStrictEqual(store.getWinners(), [{ name: 'Alice', position: 'Chair' }])

  const added = { name: 'Bob', position: 'Secretary' }
  store.addWinner(added)
  added.name = 'Changed input'
  equal(store.getWinners()[1].name, 'Bob')
})

test('different stores do not share election state', () => {
  const first = new ElectionStore()
  const second = new ElectionStore()
  first.setTitle('Election')
  first.addCandidate('Alice')
  first.addWinner({ name: 'Alice', position: 'Chair' })
  equal(second.getTitle(), '')
  deepStrictEqual(second.getCandidates(), {})
  deepStrictEqual(second.getWinners(), [])
})
