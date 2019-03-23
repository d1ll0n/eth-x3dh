const { X3DH_Sending, X3DH_Receiving } = require('./x3dh')
const { 
  generateKeyBundle,
  sendArgsFromBundles,
  receiveArgsFromBundles
} = require('./bundle')

const separator = '-'.repeat(20)

async function testWithoutOT() {
  console.log(`TESTING WITHOUT ONE TIME KEYS\n${separator}`)
  const alice = generateKeyBundle()
  const bob = generateKeyBundle()
  const sendArgs = sendArgsFromBundles(alice.toPrivate(), bob.toPublic())
  const x3dhSending = await X3DH_Sending(...sendArgs)
  console.log(`Alice's Derived X3DH Key ${x3dhSending}`)
  const receiveArgs = receiveArgsFromBundles(bob.toPrivate(), alice.toPublic())
  const x3dhReceiving = await X3DH_Receiving(...receiveArgs)
  console.log(`Bob's Derived X3DH Key ${x3dhReceiving}`)
  console.log(`KEYS MATCH: ${x3dhReceiving == x3dhSending}\n`)
}

async function testWithOT() {
  console.log(`TESTING WITH ONE TIME KEYS ${separator}`)
  const alice = generateKeyBundle(true)
  const bob = generateKeyBundle(true)
  const sendArgs = sendArgsFromBundles(alice.toPrivate(), bob.toPublic())
  const x3dhSending = await X3DH_Sending(...sendArgs)
  console.log(`Alice's Derived X3DH Key ${x3dhSending}`)
  const receiveArgs = receiveArgsFromBundles(bob.toPrivate(), alice.toPublic())
  const x3dhReceiving = await X3DH_Receiving(...receiveArgs)
  console.log(`Bob's Derived X3DH Key ${x3dhReceiving}`)
  console.log(`KEYS MATCH: ${x3dhReceiving == x3dhSending}\n`)
}

testWithoutOT().then(() => testWithOT())