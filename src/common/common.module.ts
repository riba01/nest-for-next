import { Module } from '@nestjs/common';
import { BrcyptHashService } from './hash/bcrypt-hash.service';
import { HashService } from './hash/hash.service';

@Module({
  providers: [
    {
      provide: HashService,
      useClass: BrcyptHashService,
    },
  ],
  exports: [HashService],
})
export class CommonModule {}
