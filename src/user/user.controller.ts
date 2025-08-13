import { Controller, Get, Param } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe';

@Controller('user')
export class UserController {
  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    //console.log(id, typeof id);
    return `Olá return do user #${id}`;
  }
}
