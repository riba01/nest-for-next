import { BadRequestException, Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateRandomSuffix } from '../common/utils/generate-random-suffix';

@Injectable()
export class UploadService {
  async handleUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const maxFileSize = 900 * 1024;

    if (file.size > maxFileSize) {
      throw new BadRequestException('Arquivo muito grande');
    }

    // Import fileTypeFromBuffer and its type
    // import { fileTypeFromBuffer, FileTypeResult } from 'file-type'; (add this at the top of your file)

    const fileType = await fileTypeFromBuffer(file.buffer);

    if (
      !fileType ||
      !fileType.mime ||
      !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
        fileType.mime,
      )
    ) {
      throw new BadRequestException(
        'Arquivo inválido ou tipo de arquivo não suportado',
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const uploadPath = resolve(__dirname, '..', '..', 'uploads', today);

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${generateRandomSuffix()}`;
    const fileExtension = fileType.ext;
    const fileName = `${uniqueSuffix}.${fileExtension}`;
    const filePath = resolve(uploadPath, fileName);
    const url = process.env.URL_UPLOAD;

    writeFileSync(filePath, file.buffer);

    return {
      url: `${url}/${today}/${fileName}`,
    };
    //fim handleUpload
  }
}
