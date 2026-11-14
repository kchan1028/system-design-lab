import { runScenario } from '../src/simulation.ts'
for (const scenario of ['duplicate', 'crash', 'stale', 'delete']) {
  const model = runScenario(scenario)
  console.log(`\nScenario: ${scenario}`)
  for (const line of model.trace) console.log(`  ${line}`)
  console.log(`  Published pointer: ${model.result ?? 'none'}`)
  console.log(`  Objects awaiting cleanup: ${model.orphanObjects.join(', ') || 'none'}`)
}
console.log('\nDeterministic model only. No real queue, database, worker, timings or benchmark. See docs/simulation.md.')
