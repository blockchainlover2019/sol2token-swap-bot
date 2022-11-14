import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Solswap } from "../target/types/solswap";

describe("solswap", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solswap as Program<Solswap>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});