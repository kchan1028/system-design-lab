export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
export function sectionLink(route: string, id: string) { return `#${route}?section=${encodeURIComponent(id)}` }
// A prerendered /studies/<id>/ page hands over to the hash route at the site root, keeping one routing model.
export function adoptStaticPath(loc: Pick<Location, 'pathname' | 'hash'> = location, replace: (url: string) => void = url => history.replaceState(null, '', url)) {
  const match = loc.pathname.match(/^(.*\/)studies\/([a-z0-9-]+)\/?$/)
  if (match) replace(`${match[1]}${loc.hash || `#/studies/${match[2]}`}`)
}
export function readLocation() {
  const [route = '/', query = ''] = (location.hash.slice(1) || '/').split('?')
  return { route, section: new URLSearchParams(query).get('section') }
}
export function headings(markdown: string) {
  return markdown.split('\n').filter(line => line.startsWith('## ')).map(line => ({title: line.slice(3), id: headingId(line.slice(3))}))
}
