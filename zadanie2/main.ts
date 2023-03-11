/**
 * Returns the length of the Collatz sequence starting with n.
 * @param n The starting number.
 */
function getCollatzLength (n: number): number {
  let length = 1
  while (n !== 1) {
    if (n % 2 === 0) {
      n = n / 2
    } else {
      n = 3 * n + 1
    }
    // console.log(n)
    length++
  }
  return length
}

/**
 * Finds the starting number under limit that produces the longest Collatz sequence.
 * @param limit The upper limit.
 */
function findLongestCollatzSequence (limit: number): number {
  let maxLength = 0
  let maxStart = 0
  for (let i = 1; i < limit; i++) {
    const length = getCollatzLength(i)
    if (length > maxLength) {
      maxLength = length
      maxStart = i
    }
  }
  return maxStart
}

const limit = 1000000
console.log(findLongestCollatzSequence(limit))
