import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers'
import { SIGNING_MESSAGE } from './constants/constant';
import { WalletDto } from './dto/wallet.dto';
import { Nonce, SignaturePayload } from './types';
import SignatureDto from './dto/signature.dto';

@Injectable()
export class AuthenticationService {
  public hello(){
    return "Hello From authentication"
  }

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

  async verifySignature(signatureDto: SignatureDto): Promise<boolean> {
      // Logger.verbose(`"[verifySignature]: address "${address}", signature "${payload.signature}"`)

      console.log(signatureDto)
      const recoveredAddress = ethers.utils.verifyMessage(signatureDto.nonce.message, signatureDto.signature)

      // Logger.verbose(`[verifySignature]: recoveredAddress "${recoveredAddress}"`)

      return recoveredAddress.toLowerCase() === signatureDto.walletAddress.toLowerCase()
  }
}
