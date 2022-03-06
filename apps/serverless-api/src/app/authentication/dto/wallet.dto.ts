import { IsEthereumAddress, IsString } from 'class-validator';

export class WalletDto {
  @IsEthereumAddress()
  @IsString()
  walletAddress: string;
}

export default WalletDto;