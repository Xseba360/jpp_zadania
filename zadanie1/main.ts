/**
 * Convert a number between 1 and 1000 to words in british english and using 'and' according to british english rules
 * @param number
 */
function numberToWords (number: number): string {
  if (number < 1 || number > 1000) {
    throw new Error('Number must be between 1 and 1000')
  }
  if (number % 1 !== 0) {
    throw new Error('Number must be an integer')
  }
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const hundreds = ['', 'one hundred', 'two hundred', 'three hundred', 'four hundred', 'five hundred', 'six hundred', 'seven hundred', 'eight hundred', 'nine hundred']

  const numberString = String(number)
  const numberLength = numberString.length

  if (numberLength === 1) {
    return ones[number]
  } else if (numberLength === 2) {
    if (number < 20) {
      return teens[number - 10]
    } else {
      return tens[numberString[0]] + (numberString[1] !== '0' ? '-' + ones[numberString[1]] : '')
    }
  } else if (numberLength === 3) {
    return hundreds[numberString[0]] + (numberString[1] !== '0' || numberString[2] !== '0' ? ' and ' + numberToWords(parseInt(numberString[1] + numberString[2])) : '')
  } else if (numberLength === 4) {
    return 'one thousand'
  }
}

/**
 * Count the number of letters in a string (excluding spaces and hyphens)
 * @param string
 */
function countOfLettersInAString (string: string) {
  return string.replace(/[^a-z]/gi, '').length
}
let totalCount = 0
for (let i = 1; i <= 1000; i++) {
  totalCount += countOfLettersInAString(numberToWords(i))
}
console.log(totalCount)
