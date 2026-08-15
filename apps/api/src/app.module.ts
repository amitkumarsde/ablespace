import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Load .env config globally.
    ConfigModule.forRoot({ isGlobal: true }),
    // Connect to MongoDB.
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGO_URL') }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
