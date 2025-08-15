import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    //console.log(id, typeof id);
    /* console.log(process.env.TESTE); */
    /* console.log(this.configService.get('TESTE1', 'Valor padrão')); */
    return `Olá return do user #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
