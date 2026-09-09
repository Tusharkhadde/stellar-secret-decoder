require("dotenv").config();
const StellarHDWalletMod = require("stellar-hd-wallet");
const StellarHDWallet = StellarHDWalletMod.default || StellarHDWalletMod;
const bip39 = require("bip39");

function main() {
  const mnemonic = process.env.MNEMONIC;

  if (!mnemonic || mnemonic.trim() === "" || mnemonic.includes("your 12-word")) {
    console.error("ERROR: MNEMONIC is not set in your .env file.");
    console.error("Copy .env.example to .env and fill in your 12-word phrase.");
    process.exit(1);
  }

  const trimmed = mnemonic.trim();
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount !== 12 && wordCount !== 24) {
    console.error(`ERROR: Expected a 12 or 24 word mnemonic, but found ${wordCount} words.`);
    process.exit(1);
  }

  if (!bip39.validateMnemonic(trimmed)) {
    console.error("ERROR: The mnemonic is NOT a valid BIP39 phrase (wrong words or checksum).");
    process.exit(1);
  }

  let wallet;
  try {
    wallet = StellarHDWallet.fromMnemonic(trimmed);
  } catch (err) {
    console.error("ERROR: Failed to derive wallet from mnemonic:", err.message);
    process.exit(1);
  }

  const index = 0;
  const publicKey = wallet.getPublicKey(index);
  const secretKey = wallet.getSecret(index);

  if (!publicKey.startsWith("G") || !secretKey.startsWith("S")) {
    console.error("ERROR: Derived keys have unexpected format.");
    process.exit(1);
  }

  console.log("Derivation path (account index 0): m/44'/148'/0'");
  console.log("Public Key :", publicKey);
  console.log("Secret Key :", secretKey);
}

try {
  main();
} catch (err) {
  console.error("Unexpected error:", err.message);
  process.exit(1);
}
