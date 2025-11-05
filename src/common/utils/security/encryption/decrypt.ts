
import { createDecipheriv } from "crypto";
import { algorithm, key } from "./encrypt";


export const decrypt = (encryptedText: string): string => {
    const [ivHex, contentHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(contentHex, 'hex');
  
    const decipher = createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted.toString('utf8');
  };