import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Título precisa ser uma string' })
  @Length(10, 100, { message: 'Título precisa ter entre 10 e 100 caracteres' })
  title: string;

  @IsString({ message: 'Descrição precisa ser uma string' })
  @Length(10, 200, {
    message: 'Descrição precisa ter entre 10 e 200 caracteres',
  })
  excerpt: string;

  @IsString({ message: 'Conteúdo precisa ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo não pode ser vazio' })
  content: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'Imagem precisa ser uma URL' })
  coverImageUrl?: string;
}
