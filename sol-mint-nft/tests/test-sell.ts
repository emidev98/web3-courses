import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MintNft } from "../target/types/mint_nft";
import { createKeyPairFromFile } from "./utils";

describe("sell-nft", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.MintNft as Program<MintNft>;

  it("SELL!", async () => {
    const saleAmount = (5 * anchor.web3.LAMPORTS_PER_SOL) - 2039280;
    const mint: anchor.web3.PublicKey = new anchor.web3.PublicKey(
      "..."
    );
    const buyer: anchor.web3.Keypair = createKeyPairFromFile(
      __dirname + "/target/buyer.json"
    );

    const ownerTokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: wallet.publicKey,
    });

    const buyerTokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: buyer.publicKey,
    });

    await program.methods
      .sell(new anchor.BN(saleAmount))
      .accounts({
        mint: mint,
        ownerTokenAccount: ownerTokenAddress,
        ownerAuthority: wallet.publicKey,
        buyerTokenAccount: buyerTokenAddress,
        buyerAuthority: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();
  });
});
