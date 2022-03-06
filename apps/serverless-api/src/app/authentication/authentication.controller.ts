import { Controller, Get, Body, Post } from '@nestjs/common';
import { Nonce } from './types/index'
import { AuthenticationService } from './authentication.service';
import { WalletDto } from './dto/wallet.dto';
import SignatureDto from './dto/signature.dto';

@Controller('')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
  ) {}

  @Get('hello')
  hello() {
    return this.authService.hello()
  }

  @Get('nonce')
  generateNonce(@Body() walletData: WalletDto): Promise<Nonce> {
    return this.authService.generateNonce(walletData)
  }

  @Post('signature')
  verifySignature(@Body() signatureDto: SignatureDto): Promise<boolean> {
      return this.authService.verifySignature(signatureDto)
  }
}
