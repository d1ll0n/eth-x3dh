const { createHmac } = require('crypto')

const HMAC = (input, salt, encoding = 'hex') => createHmac('sha512', salt).update(input).digest(encoding)

const defaultOptions = {
  info: 'eth-x3dh',
  outLen: 64,
  iterations: 3
}

function HKDF(input, salt = '0'.repeat(512), { info, outLen, iterations} = defaultOptions) {
  const PRK = HMAC(input, salt)
  let T = ['']
  for (let i = 0; i <= iterations; i++) {
    const _input = [T[i], info + i].join('')
    T.push(HMAC(PRK, _input))
  }
  return T.join('').slice(0, outLen)
}

module.exports = {
  HKDF,
  HMAC
}