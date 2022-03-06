// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

/**
 * Hash: Byte32 message created using solidityKeccak256
 * address: User wallet address
 * Signature: Signed message by user (Byte32)
 *
 * @param Req The payload containing Address, Hash and Signature
 *
 * {wallet_address: '0x....', nonce: { value: '0x....', message: 'string' }, signature: '0x....'}
 *
 * @returns true if address is successfully recovered from signature @else false
 *
 */
async function Signature(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const { wallet_address, nonce, signature } = request.body;

    const recoveredAddress = ethers.utils.verifyMessage(
      nonce.message,
      signature,
    );

    const bool =
      recoveredAddress?.toLowerCase() === wallet_address.toLowerCase();

    response.status(200).json(bool);
  } else {
    response.status(403).json({
      response: `${request.method} Forbidden`,
    });
  }
}

export default Signature;
