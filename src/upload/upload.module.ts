import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads', //define a URL base
      serveStaticOptions: {
        index: false, //não continua caso não encontre o arquivo
        fallthrough: false, // impede tentativa de servir "index.html"
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
