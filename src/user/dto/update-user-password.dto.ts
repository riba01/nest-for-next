import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  currentPassword: string;

  @IsString({ message: 'Nova Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Nova Senha não pode estar vazia' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve ter no mínimo 6 caracteres, incluindo ao menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo.',
    },
  )
  newPassword: string;
}
