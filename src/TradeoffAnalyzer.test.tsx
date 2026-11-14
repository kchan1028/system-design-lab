import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { TradeoffAnalyzer } from './TradeoffAnalyzer'
import { compareArchitectures, defaultAssumptions } from './tradeoffs'

test('edits apply explicitly, unknown assumptions stay unresolved, and reset is a draft', async () => {
  const user = userEvent.setup()
  render(<TradeoffAnalyzer />)
  const sync = screen.getByRole('article', {name:'Synchronous request processing'})
  expect(sync).toHaveTextContent('Variable extraction time')
  await user.selectOptions(screen.getByLabelText('Processing duration'),'bounded')
  expect(screen.getByRole('status')).toHaveTextContent('Unapplied edits')
  expect(sync).toHaveTextContent('Variable extraction time')
  await user.click(screen.getByRole('button',{name:'Apply assumptions'}))
  expect(sync).toHaveTextContent('Bounded work may fit')
  await user.selectOptions(screen.getByLabelText('Processing duration'),'unknown')
  await user.selectOptions(screen.getByLabelText('Recovery requirement'),'resume')
  await user.clear(screen.getByLabelText('Evidence and unresolved constraints'))
  await user.click(screen.getByRole('button',{name:'Apply assumptions'}))
  expect(sync).toHaveTextContent('Duration is unknown')
  expect(screen.getByText(/No evidence notes supplied/)).toBeVisible()
  expect(screen.getByRole('article',{name:'Queue, transactional outbox and workers'})).toHaveTextContent('Outbox delivery alone does not resume')
  await user.click(screen.getByRole('button',{name:'Reset draft to study assumptions'}))
  expect(screen.getByLabelText('Processing duration')).toHaveValue('variable')
  expect(sync).toHaveTextContent('Duration is unknown')
  await user.click(screen.getByRole('button',{name:'Apply assumptions'}))
  expect(sync).toHaveTextContent('Variable extraction time')
  expect(within(sync).getByText('Cost drivers')).toBeVisible()
})

test('all assumption combinations keep three complete qualitative alternatives', () => {
  for (const duration of ['bounded','variable','unknown'] as const)
    for (const arrivals of ['steady','bursty','unknown'] as const)
      for (const recovery of ['restart','resume','unknown'] as const)
        for (const operations of ['limited','experienced','unknown'] as const) {
          const results = compareArchitectures({duration,arrivals,recovery,operations})
          expect(results).toHaveLength(3)
          for (const option of results) {
            for (const value of Object.values(option)) { expect(value.length).toBeGreaterThan(0); expect(value).not.toMatch(/\$|\d+%|score/i) }
          }
        }
  expect(defaultAssumptions).toEqual({duration:'variable',arrivals:'bursty',recovery:'restart',operations:'limited'})
})
