
import { createCipheriv, randomBytes, scryptSync } from 'crypto';


export const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-ctr';
export const password = process.env.ENCRYPTION_SECRET || 'moElb7ar';
export const salt = process.env.ENCRYPTION_SALT || 'salt';

export const key = scryptSync(password, salt, 32);


export const encrypt = (text: string): string => {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  };