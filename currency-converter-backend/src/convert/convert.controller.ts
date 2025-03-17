import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertDto } from './dto/convert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async convert(@Body() convertDto: ConvertDto, @Req() req: any) {
    const user = req.user;
    return this.convertService.convertCurrency(user.id, convertDto);
  }
}
