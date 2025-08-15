import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
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
    const userExist = await this.userRepository.exists({
      where: {
        email: dto.email,
      },
    });

    if (userExist) {
      throw new ConflictException('E-mail já cadastrado');
    }

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
}
