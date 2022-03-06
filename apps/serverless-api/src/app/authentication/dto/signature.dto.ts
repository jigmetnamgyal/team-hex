import { IsEthereumAddress, IsString, IsObject } from 'class-validator';

export class SignatureDto {
  @IsEthereumAddress()
  @IsString()
  walletAddress: string

  @IsObject()
  nonce: {
    message: string;
  }

  @IsString()
  signature: string;

}

export default SignatureDto;