const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const {keccak256} = require("ethereum-cryptography/keccak")

const privKey = secp.utils.randomPrivateKey();
const pubKey = secp.getPublicKey(privKey)
const address = keccak256(pubKey.slice(1)).slice(12)

console.log('privKey', toHex(privKey))
console.log('address', toHex(address))
