import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import UserModule from './module/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import BrandModule from './module/Brands/Brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:"./config/.env",
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONG_URL as string , {
  onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log(`Success To connect DB on ${process.env.MONG_URL}`));
    return connection;
  }
  }),
    UserModule ,
    BrandModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

