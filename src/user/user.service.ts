import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto) {
    //Email precisa ser único
    await this.failIfExistByEmail(dto.email);
    //Precsa fazer hash de senha
    const hashedPassword = await this.hashService.hash(dto.password);
    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };
    //Salvar na BD
    const created = await this.userRepository.save(newUser);
    return created;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }
  async failIfExistByEmail(email: string) {
    const exits = await this.userRepository.findOneBy({ email });
    if (exits) {
      throw new ConflictException('E-mail já cadastrado');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email) {
      throw new BadRequestException('Dados não enviados');
    }
    const userExist = await this.findOneByOrFail({ id });

    userExist.name = dto.name ?? userExist.name;

    if (dto.email && userExist.email !== dto.email) {
      //o usuário quer trocar o email
      //checar se o email não existe na BD

      await this.failIfExistByEmail(dto.email);
      userExist.email = dto.email;
      userExist.forceLogout = true;
      /* console.log(userExist); */
    }
    return this.save(userExist);
  }
  async updatePassword(id: string, dto: UpdateUserPasswordDto) {
    const user = await this.findOneByOrFail({ id });
    const isCurrentPasswordValid = await this.hashService.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    user.password = await this.hashService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }
  async remove(id: string) {
    const user = await this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }
}
