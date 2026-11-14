import { act, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { Diagram } from './Diagram'
const mermaid = vi.hoisted(() => ({initialize:vi.fn(), render:vi.fn()}))
vi.mock('mermaid', () => ({default:mermaid}))

test('initialize once and ignore a stale render after a source switch', async () => {
  let finishOld!: (value: {svg:string}) => void
  mermaid.render.mockImplementationOnce(() => new Promise(resolve => { finishOld = resolve }))
    .mockResolvedValueOnce({svg:'<svg aria-label="Current diagram"></svg>'})
  const ready = vi.fn()
  const view = render(<Diagram source="old" onReady={ready}/>)
  await waitFor(() => expect(mermaid.render).toHaveBeenCalledTimes(1))
  view.rerender(<Diagram source="current" onReady={ready}/>)
  await waitFor(() => expect(screen.getByLabelText('Current diagram')).toBeInTheDocument())
  await act(async () => finishOld({svg:'<svg aria-label="Stale diagram"></svg>'}))
  expect(screen.queryByLabelText('Stale diagram')).not.toBeInTheDocument()
  expect(mermaid.initialize).toHaveBeenCalledTimes(1)
  expect(ready).toHaveBeenCalledTimes(1)
})

test('render failure preserves a readable source fallback', async () => {
  mermaid.render.mockRejectedValueOnce(new Error('synthetic renderer failure'))
  render(<Diagram source={'flowchart LR\n A --> B'}/>)
  expect(await screen.findByText('Diagram unavailable. Read the source below.')).toBeVisible()
  expect(screen.getByText(/flowchart LR/)).toBeInTheDocument()
})
