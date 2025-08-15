import bcrypt from 'node_modules/bcryptjs';
import { HashService } from './hash.service';

export class BrcyptHashService extends HashService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hash);

    return isValid;
  }
}
