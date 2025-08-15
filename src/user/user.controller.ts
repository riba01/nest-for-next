import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/autenticated-request';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', CustomParseIntPipe) id: number,
  ) {
    //console.log(id, typeof id);
    /* console.log(process.env.TESTE); */
    /* console.log(this.configService.get('TESTE1', 'Valor padrão')); */
    console.log(req.user.id);
    return `Olá return do user #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch('me')
  update(@Body() dto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.userService.update(req.user.id, dto);
  }
}
