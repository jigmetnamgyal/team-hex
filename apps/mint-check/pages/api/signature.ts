// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'


/**
   * Hash: Byte32 message created using solidityKeccak256
   * address: User wallet address
   * Signature: Signed message by user (Byte32)
   * 
   * @param Req The payload containing Address, Hash and Signature
   * @returns true if address is successfully recovered from signature @else false
   * 
*/ 
async function GenerateNonce (req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, nonce, signature } = req.body

  const recoveredAddress =  ethers.utils.verifyMessage(nonce.message, signature)
  
  const bool = (recoveredAddress === walletAddress)
  
  res.status(200).json(bool)
  
}

export default GenerateNonce;