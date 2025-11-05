
import { PipeTransform, ArgumentMetadata, HttpException } from '@nestjs/common';
import {  ZodType  } from 'zod';

export class UserValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {

    const {success , error} = this.schema.safeParse(value);
    console.log({success , error});
    
    if (!success) {
        throw new HttpException({
          message : "Validation Error" ,
          error : error.issues.map((issues) => {
            return {
              message:issues.message,
              path : issues.path
            }
          })
        } ,  400)
    }
    return value;
    }
  }