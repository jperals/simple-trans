function filterRow (row, filters) {
  let match = true
  for (const languageId of Object.keys(filters)) {
    const filter = filters[languageId]
    const translation = row[languageId]
    match =
      match &&
      (!filter || filter.length === 0 || translation && translation.length && translation.toLowerCase().includes(filter.toLowerCase()))
    if(!match) {
      break
    }
  }
  return match
}

function filterTranslations (translations, filters) {
  const filtered = {}
  const languageIds = Object.keys(translations)
  const msgids = Object.keys(translations[languageIds[0]])
  for (const languageId of languageIds) {
    filtered[languageId] = {}
  }
  for (const msgid of msgids) {
    const row = {
      src: msgid
    }
    for (const languageId of languageIds) {
      row[languageId] = translations[languageId][msgid]
    }
    if (filterRow(row, filters)) {
      for (const languageId of languageIds) {
        filtered[languageId][msgid] = translations[languageId][msgid]
      }
    }
  }
  return filtered
}

module.exports = filterTranslations
