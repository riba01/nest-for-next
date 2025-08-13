import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe';

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    //console.log(id, typeof id);
    /* console.log(process.env.TESTE); */
    console.log(this.configService.get('TESTE1', 'Valor padrão'));
    return `Olá return do user #${id}`;
  }
}
