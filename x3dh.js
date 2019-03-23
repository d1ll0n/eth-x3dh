const { derive } = require('eccrypto')
const {
  publicKey: { decompress: decompressPubkey },
  util: { removeTrailing0x }
} = require('eth-crypto')

const { HKDF: hkdf } = require('./hkdf')

function computeSecret(privateKey, publicKey) {
  const pubKey = '04' + decompressPubkey(publicKey)
  const privKey = removeTrailing0x(privateKey)
  return derive(Buffer.from(privKey, 'hex'), Buffer.from(pubKey, 'hex'))
}

async function X3DH_Sending(idKeyPrivate, ephKeyPrivate, idKeyPublic, preKeyPublic, otPreKeyPublic) {
  const DH = []
  DH.push(await computeSecret(idKeyPrivate, preKeyPublic))
  DH.push(await computeSecret(ephKeyPrivate, idKeyPublic))
  DH.push(await computeSecret(ephKeyPrivate, preKeyPublic))
  if (otPreKeyPublic) DH.push(await computeSecret(ephKeyPrivate, otPreKeyPublic))
  return hkdf(DH.join(''))
}

async function X3DH_Receiving(idKeyPrivate, preKeyPrivate, idKeyPublic, ephKeyPublic, otPreKeyPrivate) {
  const DH = []
  DH.push(await computeSecret(preKeyPrivate, idKeyPublic))
  DH.push(await computeSecret(idKeyPrivate, ephKeyPublic))
  DH.push(await computeSecret(preKeyPrivate, ephKeyPublic))
  if (otPreKeyPrivate) DH.push(await computeSecret(otPreKeyPrivate, ephKeyPublic))
  return hkdf(DH.join(''))
}

const CREATE_AD = (idKey1, idKey2) => idKey1 + idKey2

module.exports = {
  X3DH_Sending,
  X3DH_Receiving,
  CREATE_AD
}