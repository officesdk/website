export function matchesSearchText(indexedText: string | undefined, query: string) {
  const terms = query.toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []
  if (!terms.length) return true
  const tokens = indexedText?.split(' ') ?? []
  return terms.every(term => tokens.includes(term) || (term.length >= 4 && tokens.some(token => token.startsWith(term))))
}
