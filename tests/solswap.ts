import * as anchor from "@project-serum/anchor";

import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  // @ts-ignore
  getAssociatedTokenAddress,
  // @ts-ignore
  createAssociatedTokenAccountInstruction,
  // @ts-ignore
  mintTo,
  // @ts-ignore
  createMint,
} from "@solana/spl-token";

// describe("solswap", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.Solswap as Program<Solswap>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

import * as Constants from "./constants";
import { IDL } from "./solswapidl";
import * as keys from "./keys";


const connection = new Connection(clusterApiUrl(Constants.NETWORK));
let secretKey = Uint8Array.from([12,12,8,4,121,169,38,71,246,172,103,213,199,122,181,91,17,76,180,17,238,27,79,151,89,68,92,146,122,35,80,39,51,252,173,227,112,172,251,165,233,216,18,234,14,56,252,144,42,34,218,6,147,114,137,99,68,248,88,91,84,104,86,134]);



export const getProgram = () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  let provider = anchor.getProvider();
  // console.log("provider:", provider);
  //   connection,
  //   wallet,
  //   anchor.Provider.defaultOptions()
  // );
  const program = new anchor.Program(IDL, Constants.PROGRAM_ID, provider);
  // console.log("program:", program);
  return program;

};

export const initializeProgram = async (
  wallet: Keypair
): Promise<string> => {
  if (wallet.publicKey === null) throw new Error();
  const program = getProgram();
  const txHash = await program.methods
    .initialize(
    //   wallet.publicKey,
    //   Constants.TREASURY,
    //   Constants.DEFAULT_TIER_DAYS,
    //   Constants.DEFAULT_TIER_PERCENT,
    //   Constants.DEFAULT_MAX_TIER
    )
    .accounts({
      admin: wallet.publicKey,
      settings: await keys.getSettingsKey(),
      botrole: await keys.getBotRoleKey(),
      pool: await keys.getPoolKey(),
      wsolMint: Constants.SPL_TOKEN_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  if (txHash != null) {
    console.log(
      "Confirming Transaction ..."
    );

    // showToast("Confirming Transaction ...", 10000, 2);
    let res = await connection.confirmTransaction(txHash);
    if (res.value.err) {
      console.log("Trasaction Failed");
      // showToast("Transaction Failed", 2000, 1);
    } else {
      console.log("Trasaction Confirmed");
    }
  } else {
    console.log("Trasaction Failed");
    // showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
};

export const swapToken = async (
  wallet: Keypair
): Promise<any> => {
  if (wallet.publicKey === null) throw new Error();
  const program = getProgram();
  const txHash = await program.methods.swapSolToToken(new anchor.BN(10000000),new anchor.BN(12000000000),new anchor.BN(500), new anchor.BN(10))
    .accounts({
      authority: wallet.publicKey,
      pool: await keys.getPoolKey(),
      botrole: await keys.getBotRoleKey(),
      poolCoinTokenAccount: Constants.poolCoinTokenAccount,
      poolPcTokenAccount: Constants.poolPcTokenAccount,
      uerSourceTokenAccount: Constants.uerSourceTokenAccount,
      uerDestinationTokenAccount: Constants.uerDestinationTokenAccount,
      wsolMint: Constants.wsolMint,
      outMint: Constants.outMint,
      ammId: Constants.ammId,
      ammAuthority: Constants.ammAuthority,
      ammOpenOrders: Constants.ammOpenOrders,
      ammTargetOrders: Constants.ammTargetOrders,
      serumProgram: Constants.serumProgram,
      serumMarket:Constants.serumMarket,
      serumBids: Constants.serumBids,
      serumAsks: Constants.serumAsks,
      serumEventQueue: Constants.serumEventQueue,
      serumCoinVault: Constants.serumCoinVault,
      serumPcVault: Constants.serumPcVault,
      serumVaultSigner: Constants.serumVaultSigner,
      raydiumAmmProgram: Constants.raydiumAmmProgram,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

  if (txHash != null) {
    console.log(
      "Confirming Transaction ..."
    );

    // showToast("Confirming Transaction ...", 10000, 2);
    let res = await connection.confirmTransaction(txHash);
    if (res.value.err) {
      console.log("Trasaction Failed");
      // showToast("Transaction Failed", 2000, 1);
    } else {
      console.log("Trasaction Confirmed");
    }
  } else {
    console.log("Trasaction Failed");
    // showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
};


describe("solswap", () => {
  it("Is initialized!", async () => {
    // let wallet = Keypair.fromSecretKey(secretKey);
    // const res = await initializeProgram(wallet);
    // console.log("hxhash:", res);
  });

  it("token swap!", async () => {
    let wallet = Keypair.fromSecretKey(secretKey);
    const res = await swapToken(wallet);
    console.log("hxhash:", res);
  });

});
