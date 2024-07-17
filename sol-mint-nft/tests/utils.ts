import * as anchor from "@coral-xyz/anchor";
import {readFileSync} from 'fs';

export function createKeyPairFromFile(filePath: string): anchor.web3.Keypair {
  const secretKeyString = readFileSync(filePath, 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return anchor.web3.Keypair.fromSecretKey(secretKey);
}