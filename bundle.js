const { createIdentity: createKeypair } = require('eth-crypto')

const bundleToPublic = ({ identity, preKey, oneTime }) => ({
  identity: identity.publicKey,
  preKey: preKey.publicKey,
  oneTime: oneTime && oneTime.publicKey
})

const bundleToPrivate = ({ identity, preKey, oneTime }) => ({
  identity: identity.privateKey,
  preKey: preKey.privateKey,
  oneTime: oneTime && oneTime.privateKey
})

function generateKeyBundle(withOneTime = false) {
  const identity = createKeypair()
  const preKey = createKeypair()
  const oneTime = withOneTime && createKeypair
  const bundle = { identity, preKey, oneTime }
  return {
    ...bundle,
    toPrivate: () => bundleToPrivate(bundle),
    toPublic: () => bundleToPublic(bundle)
  }
}

const sendArgsFromBundles = (privateBundle, publicBundle) => [
  privateBundle.identity, 
  privateBundle.preKey,
  publicBundle.identity,
  publicBundle.preKey,
  publicBundle.oneTime
]

const receiveArgsFromBundles = (privateBundle, publicBundle) => [
  privateBundle.identity, 
  privateBundle.preKey,
  publicBundle.identity,
  publicBundle.preKey,
  publicBundle.oneTime
]

module.exports = {
  bundleToPublic,
  bundleToPrivate,
  generateKeyBundle,
  sendArgsFromBundles,
  receiveArgsFromBundles
}