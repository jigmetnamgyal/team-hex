import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers'
import { SIGNING_MESSAGE } from './constants/constant';
import { WalletDto, SignatureDto } from './dto/index'
import { Nonce } from './types';

@Injectable()
export class AuthenticationService {

  /**
   * Generate byte32 hash from user wallet and nonce
   * 
   * @param walletAddress The wallet address of the user
   * 
   * @returns Byte32 Hash after packing the wallet and nonce using solidityKeccak256
   * */ 

  async generateNonce(walletData: WalletDto): Promise<Nonce> {
    const nonce = ethers.utils.hexlify(new Date().getTime());
    const wallet = walletData.walletAddress
    const hash = ethers.utils.solidityKeccak256(["string", "string"], [nonce, wallet]);

    return {
      message: SIGNING_MESSAGE.replace('{NONCE_VALUE}', hash),
      value: hash,
    };
  }

  /**
   * Hash: Byte32 message created using solidityKeccak256
   * address: User wallet address
   * Signature: Signed message by user (Byte32)
   * 
   * @param signatureDto The payload containing Address, Hash and Signature
   * @returns true if address is successfully recovered from signature @else false
   * 
   */ 

  async verifySignature(signatureDto: SignatureDto): Promise<boolean> {
      Logger.verbose(`"[verifySignature]: address "${signatureDto.walletAddress}", signature "${signatureDto.signature}"`)

      const recoveredAddress = ethers.utils.verifyMessage(signatureDto.nonce.message, signatureDto.signature)

      Logger.verbose(`[verifySignature]: recoveredAddress "${recoveredAddress}"`)

      return recoveredAddress === signatureDto.walletAddress
  }
}
