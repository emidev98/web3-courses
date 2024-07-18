import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProgramDerivedAddresses } from "../target/types/program_derived_addresses";

describe("program-derived-addresses", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .ProgramDerivedAddresses as Program<ProgramDerivedAddresses>;

  function derivePda(color: string, pubkey: anchor.web3.PublicKey) {
    let [pda, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [pubkey.toBuffer(), Buffer.from("_"), Buffer.from(color)],
      program.programId
    );
    return pda;
  }

  async function generateKeypair() {
    let keypair = anchor.web3.Keypair.generate();
    try {
      const airdropSignature = await provider.connection.requestAirdrop(
        keypair.publicKey,
        5 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSignature);
    } catch (e) {
      console.log(e.getLogs());
    }
    return keypair;
  }

  async function createLedgerAccount(
    color: string,
    pda: anchor.web3.PublicKey,
    wallet: anchor.web3.Keypair
  ) {
    try {
      await program.methods
        .createLedger(color)
        .accounts({
          ledgerAccount: pda,
          wallet: wallet.publicKey,
        })
        .signers([wallet])
        .rpc();
    } catch (e) {
      console.log(e.getLogs());
    }
  }

  async function modifyLedger(
    color: string,
    newBalance: number,
    wallet: anchor.web3.Keypair
  ) {
    let data;
    let pda = derivePda(color, wallet.publicKey);

    console.log(`Checking if account ${pda} exists for color ${color}`);
    try {
      data = await program.account.ledger.fetch(pda);
      console.log("Account exists...");
    } catch (error) {
      console.log("Account does not exist, creating...");
      await createLedgerAccount(color, pda, wallet);
      data = await program.account.ledger.fetch(pda);
    }
    console.log(`Color: ${data.color}, Balance: ${data.balance}`);
    console.log(`Modifying balance to ${newBalance}`);

    await program.methods
      .modifyLedger(newBalance)
      .accounts({
        ledgerAccount: pda,
        wallet: wallet.publicKey,
      } as any)
      .signers([wallet])
      .rpc();

    data = await program.account.ledger.fetch(pda);
    console.log(`Color: ${data.color}, New Balance: ${data.balance}`);
  }

  it("Is initialized!", async () => {
    await provider.connection.requestAirdrop(
      provider.wallet.publicKey,
      5 * anchor.web3.LAMPORTS_PER_SOL
    );

    const keypair1 = await generateKeypair();
    await modifyLedger("red", 2, keypair1);
    await modifyLedger("red", 4, keypair1);
    await modifyLedger("blue", 2, keypair1);

    const keypair2 = await generateKeypair();
    await modifyLedger("red", 100, keypair2);
    await modifyLedger("green", 300, keypair2);
  });
});
