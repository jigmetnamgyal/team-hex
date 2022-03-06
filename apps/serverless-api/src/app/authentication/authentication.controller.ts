import { Nonce } from './types/index'
import { WalletDto, SignatureDto } from './dto/index'
import { AuthenticationService } from './authentication.service';
import { Controller, Get, Body, Post } from '@nestjs/common';

@Controller('')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
  ) {}

  @Get('nonce')
  generateNonce(@Body() walletData: WalletDto): Promise<Nonce> {
    return this.authService.generateNonce(walletData)
  }

  @Post('signature')
  verifySignature(@Body() signatureDto: SignatureDto): Promise<boolean> {
      return this.authService.verifySignature(signatureDto)
  }
}
