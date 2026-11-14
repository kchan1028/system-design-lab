import { expect, test } from 'vitest'
import { PublicationModel, runScenario } from './simulation'
test('duplicate delivery after publication cannot claim or overwrite a ready job', () => {
 const model=runScenario('duplicate'); expect(model.result).toBe('attempt-a'); expect(model.claim()).toBeNull(); expect(model.orphanObjects).toEqual([])
})
test('crash before publication leaves an orphan but replacement publishes', () => {
 const model=runScenario('crash'); expect(model.result).toBe('attempt-b'); expect(model.orphanObjects).toEqual(['attempt-a'])
})
test('expired worker cannot publish after a replacement claim', () => {
 const model=runScenario('stale'); expect(model.result).toBe('attempt-b'); expect(model.trace.some(line => line.startsWith('Publication refused'))).toBe(true)
})
test('tombstone blocks late publication and clears the readable pointer', () => {
 const model=runScenario('delete'); expect(model.result).toBeNull(); expect(model.claim()).toBeNull(); expect(model.orphanObjects).toEqual(['attempt-a'])
 const ready=runScenario('duplicate'); ready.deleteDocument(); expect(ready.result).toBeNull()
})
test('publishing absent bytes fails without changing ready state', () => {
 const model=new PublicationModel(); const token=model.claim()!; expect(() => model.publish(token,'missing')).toThrow('missing object'); expect(model.state).toBe('running'); expect(model.result).toBeNull()
})
