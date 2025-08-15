import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../common/hash/hash.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    /* console.log(loginDto); */
    /* return 'Olá do AuthService'; */
    /* console.log(loginDto.email, loginDto.password);
    console.log(loginDto instanceof LoginDto, loginDto); */
    //Checar Email -> UserService preciso importar no authModule todo o userModule
    const user = await this.userService.findByEmail(loginDto.email);
    const error = new UnauthorizedException('Usuário ou senha invalidos');
    if (!user) {
      throw error;
    }
    //Comparar senha com hash -> HashService preciso importar no authModule todo o CommomModule
    const isPasswordValid = await this.hashService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw error;
    }
    //JwtService Importar o JWTModule
    const JwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(JwtPayload);

    user.forceLogout = false;
    await this.userService.save(user);

    return { accessToken };
  }
}
