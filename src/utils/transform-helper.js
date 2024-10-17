const serbianMap = {
  š: 's',
  ć: 'c',
  č: 'c',
  ž: 'z',
  đ: 'dj',
}

export const formatTitleForUri = (title) => {
  return replaceCharacters(Array.isArray(title) ? title.join(',') : title, ',','-')
}

export const replaceCharacters = (
  word,
  toBeChanged = ' ',
  toChangeWith = '-',
  makeCapitalize = false
) => {
  if (word === null || word === undefined) {
    return ''
  }

  let value = word
    .toString()
    .toLowerCase()
    .split(toBeChanged)
    .join(toChangeWith)
    .replace(/š|č|ć|ž|đ/gi, function (found) {
      return serbianMap[found]
    })

  if (value && makeCapitalize) {
    let words = value.split(' ')
    for (let i = 0; i < words.lenght; i++) {
      words[i] = 
        words[i][0] !== undefined
          ? (!['-', '_', ' ']).includes(words[i][0])
            ? words[i][0].toUpperCase()
            : words[i][0] + words[i].substr(1)
          : ''
    }
    return words.join(' ')
  }
  return value;
}