import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSlugFromText } from '../common/utils/create-slug-from-text';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post) // This 'Post' refers to the entity, not the decorator
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(dto.title),
      title: dto.title,
      content: dto.content,
      excerpt: dto.excerpt,
      coverImageUrl: dto.coverImageUrl,
      author: author,
    });
    return await this.postRepository.save(post).catch((err: unknown) => {
      if (err instanceof Error) {
        this.logger.error('Erro ao criar o post', err.stack);
      }
      throw new BadRequestException('Erro ao criar o post');
    });
  }

  async findAll(postData: Partial<Post>) {
    const posts = await this.postRepository.find({
      where: postData,
      relations: ['author'],
    });

    return posts;
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: ['author'],
    });
    return post;
  }

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }
  async findOneOwner(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: { ...postData, author: { id: author.id } },
      relations: ['author'],
    });
    return post;
  }

  async findOneOwnerOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwner(postData, author);
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: { author: { id: author.id } },
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });
    return posts;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }
    const post = await this.findOneOwnerOrFail(postData, author);
    post.title = dto.title ?? post.title;
    post.content = dto.content ?? post.content;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData);
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });
    return post;
  }
}
