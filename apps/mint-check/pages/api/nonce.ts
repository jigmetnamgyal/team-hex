// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

 /**
   * Generate byte32 hash from user wallet and nonce
   * 
   * @param walletAddress The wallet address of the user
   * 
   * @returns Byte32 Hash after packing the wallet and nonce with solidityKeccak256
   * 
*/

async function GenerateNonce (req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.body
  const nonce = await ethers.utils.hexlify(new Date().getTime())
  const message = `Team Hex dApp

  We authorize universities with verified kyc to mint and issue certificates seamlessly.
  
  Nonce: {NONCE_VALUE}
  `

  const hash = ethers.utils.solidityKeccak256(["string", "string"], [nonce, walletAddress])
  
  
  res.status(200).json({
    message: message.replace('{NONCE_VALUE}', hash),
    value: hash
  })
  
}

export default GenerateNonce;