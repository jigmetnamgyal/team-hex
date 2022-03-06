// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'


/**
   * Hash: Byte32 message created using solidityKeccak256
   * address: User wallet address
   * Signature: Signed message by user (Byte32)
   * 
   * @param Req The payload containing Address, Hash and Signature
   * 
   * {walletAddress: '0x....', Hash: '0x....', Signature: '0x....'}
   * 
   * @returns true if address is successfully recovered from signature @else false
   * 
*/ 
async function Signature (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { walletAddress, nonce, signature } = req.body

    const recoveredAddress =  ethers.utils.verifyMessage(nonce.message, signature)
    
    const bool = (recoveredAddress.toLowerCase() === walletAddress.toLowerCase())
    
    res.status(200).json(bool)
  } else {
    res.status(403).json({
      response: `${req.method} forbidden`
    });
  }
  
}

export default Signature;