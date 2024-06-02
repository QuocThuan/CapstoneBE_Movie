import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { RapModule } from './rap/rap.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { DatVeModule } from './dat-ve/dat-ve.module';

@Module({
  imports: [
    UserModule,
    MovieModule,
    RapModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatVeModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
