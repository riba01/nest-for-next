import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['title', 'excerpt', 'content', 'coverImageUrl']),
) {
  @IsOptional()
  @IsBoolean({ message: 'O campo "published" precisa ser um booleano' })
  published?: boolean;
}
