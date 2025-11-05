import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';
import { Request } from 'express';

export const MulterLocal = (
  {
    customPath = 'General',
    customValidation = [],
  }: {
    customPath?: string;
    customValidation?: Array<string>;
  },
) => {
  const path = `uploads/${customPath}`;
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }

 return {
    storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, path);
},
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    }),

    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    if (!customValidation.includes(file.mimetype)) {
        cb(new BadRequestException('Invalid file type'));
    }
    cb(null, true);
    },

    limits: {
      fileSize: 1024 * 1024 * 5, 
    },
};
};
