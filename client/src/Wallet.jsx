import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privKey,
  setPrivKey,
}) {
  async function onChange(evt) {
    const privKey = evt.target.value;

    const pubKey = secp.getPublicKey(privKey);
    setPrivKey(privKey);

    const address = toHex(keccak256(pubKey.slice(1)).slice(12));
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type a private key"
          value={privKey}
          onChange={onChange}
        ></input>
      </label>

      <label>
        Address
        <p>{address}</p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
