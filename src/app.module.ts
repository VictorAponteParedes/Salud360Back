import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LenguageModule } from './modules/lenguages/lenguage.module';
import { User } from './modules/user/entities/user.entities';
import { Doctor } from './modules/doctors/entities/doctors.entities';
import { Specialty } from './modules/specialties/entities/specialty.entity';
import { Lenguages } from './modules/lenguages/entities/lenguages.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: 'root',
      password: 'Admin123.',
      database: 'salud360_db',
      entities: [User, Doctor, Specialty, Lenguages],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    LenguageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
