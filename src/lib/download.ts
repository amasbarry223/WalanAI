export function downloadTextFile(filename: string, content: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadCsv(filename: string, headers: string[], rows: string[][]): void {
  const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
  const lines = [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))]
  downloadTextFile(filename, lines.join('\n'), 'text/csv;charset=utf-8')
}
