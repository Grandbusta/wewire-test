import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('user/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTransactions(
    @Req() req: any,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = req.user.id;
    const { page, limit } = paginationDto;
    return this.transactionsService.findByUserId(userId, page, limit);
  }
}
