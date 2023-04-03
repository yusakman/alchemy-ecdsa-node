const express = require("express");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1")
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "cb8934c72000bc226bcc368f3a96e1619e41bc31": 100,
  "bfef4dbffb3c5140482fee477964493d5407ee32": 50,
  "eae009ba8b3dce0ee94132549d0a07e0a73c56a2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const {privKey, sender, recipient, amount} = req.body;
  const msgHash = keccak256(utf8ToBytes(sender))
  const signature = await secp.sign(msgHash, privKey, {recovered: true})
  const [sig, recoveryBit] = signature;
  const publicKey = secp.recoverPublicKey(msgHash, sig, recoveryBit)
  const senderAddress = toHex(keccak256(publicKey.slice(1)).slice(12))

  setInitialBalance(senderAddress);
  setInitialBalance(recipient);

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
