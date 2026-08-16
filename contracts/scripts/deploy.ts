import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("=================================================");
  console.log("[Aptos Engine] Initializing Testnet Deployment");
  console.log("=================================================");

  // 1. Initialize Aptos SDK client
  const config = new AptosConfig({
    network: Network.TESTNET,
  });
  const aptos = new Aptos(config);

  // 2. Load Deployer / Petra Private Key
  const rawKey = process.env.APTOS_PRIVATE_KEY;
  if (!rawKey) {
    throw new Error("APTOS_PRIVATE_KEY is missing in .env");
  }

  const cleanKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const privateKey = new Ed25519PrivateKey(cleanKey);
  const deployer = Account.fromPrivateKey({ privateKey });

  console.log(`[Deployer Address] ${deployer.accountAddress.toString()}`);

  // 3. Fund Account via Faucet if balance is low
  try {
    const balance = await aptos.getAccountAPTAmount({
      accountAddress: deployer.accountAddress,
    });
    console.log(`[Account Balance]  ${balance / 100_000_000} APT`);

    if (balance === 0) {
      console.log("[Faucet] Funding deployer via Aptos Testnet Faucet...");
      await aptos.fundAccount({
        accountAddress: deployer.accountAddress,
        amount: 100_000_000, // 1 APT
      });
      console.log("[Faucet] Account funded successfully.");
    }
  } catch (error) {
    console.log("[Faucet Note] Requesting initial faucet funding...");
    await aptos.fundAccount({
      accountAddress: deployer.accountAddress,
      amount: 100_000_000,
    });
  }

  // 4. Compile Move Contract
  console.log("\n[1/3] Compiling Move contracts (aptos move compile)...");
  execSync(
    `aptos move compile --named-addresses prism=${deployer.accountAddress.toString()}`,
    { stdio: "inherit" }
  );

  // 5. Publish to Aptos Testnet
  console.log("\n[2/3] Publishing Move package to Aptos Testnet...");
  execSync(
    `aptos move publish --named-addresses prism=${deployer.accountAddress.toString()} --assume-yes`,
    { stdio: "inherit" }
  );

  // 6. On-Chain Sanity Verification (View Function Check)
  console.log("\n[3/3] Running on-chain sanity test...");
  try {
    const keyEnvelope = await aptos.view({
      payload: {
        function: `${deployer.accountAddress.toString()}::prism_ledger::get_key_envelope`,
        functionArguments: [deployer.accountAddress.toString()],
      },
    });
    console.log(`[Sanity Result] Key Envelope on chain: "${keyEnvelope[0]}"`);
  } catch (e: any) {
    console.log("[Sanity Note] Vault will auto-initialize upon first document anchor transaction.");
  }

  console.log("\n=================================================");
  console.log("Deployment Complete!"); 
  console.log(`MODULE_ADDRESS = "${deployer.accountAddress.toString()}"`);
  console.log(`MODULE_NAME    = "prism_ledger"`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});