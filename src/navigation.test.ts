import { expect, test, vi } from 'vitest'
import { adoptStaticPath } from './navigation'

test.each([
  ['/system-design-lab/studies/rag-document-search/', '', '/system-design-lab/#/studies/rag-document-search'],
  ['/studies/high-traffic-api', '', '/#/studies/high-traffic-api'],
  ['/system-design-lab/studies/rag-document-search/', '#/studies/rag-document-search?section=evaluation-plan', '/system-design-lab/#/studies/rag-document-search?section=evaluation-plan'],
])('static study path %s%s hands over to the hash route', (pathname, hash, expected) => {
  const replace = vi.fn()
  adoptStaticPath({pathname, hash}, replace)
  expect(replace).toHaveBeenCalledWith(expected)
})

test.each(['/system-design-lab/', '/', '/system-design-lab/docs/'])('non-study path %s is left alone', (pathname) => {
  const replace = vi.fn()
  adoptStaticPath({pathname, hash: '#/'}, replace)
  expect(replace).not.toHaveBeenCalled()
})
