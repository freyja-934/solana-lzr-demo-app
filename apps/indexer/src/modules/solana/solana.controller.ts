import { Controller, Get, Param, Query } from '@nestjs/common';
import { SolanaService } from './solana.service';

@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) {}

  @Get('create-token')
  async createToken(
    @Query('name') name: string,
    @Query('symbol') symbol: string,
    @Query('uri') uri: string,
    @Query('decimals') decimals: number,
    @Query('amount') amount: number,
  ) {
    return this.solanaService.createToken({
      name,
      symbol,
      uri,
      decimals,
      amount,
    });
  }

  @Get('mint')
  async mintToken(
    @Query('mint') mint: string,
    @Query('destination') destination: string,
    @Query('amount') amount: number,
  ) {
    return this.solanaService.mintToken(mint, amount, destination);
  }

  @Get('transfer')
  async transferToken(
    @Query('mint') mint: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: number,
  ) {
    return this.solanaService.transferToken(mint, from, to, Number(amount));
  }

  @Get('token-metadata/:mint')
  async getTokenMetadata(@Param('mint') mint: string) {
    console.log(mint);
    return this.solanaService.getTokenMetadata(mint);
  }

  @Get('token-metadata-devnet/:mint')
  async getTokenMetadataDevnet(@Param('mint') mint: string) {
    return this.solanaService.getTokenMetadataDevnet(mint);
  }

  @Get('associated-token-pda')
  async getAssociatedTokenPda(
    @Query('mint') mint: string,
    @Query('wallet') wallet: string,
  ) {
    return this.solanaService.getAssociatedTokenPda(mint, wallet);
  }

  @Get('nfts/:wallet')
  async getNfts(
    @Param('wallet') wallet: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.solanaService.getNftsByWallet(wallet, page, limit);
  }
}
