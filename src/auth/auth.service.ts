import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    /* console.log(loginDto); */
    /* return 'Olá do AuthService'; */
    console.log(loginDto.email, loginDto.password);
    console.log(loginDto instanceof LoginDto, loginDto);
    return loginDto;
  }
}
