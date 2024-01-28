import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core/constants';
import { ErrorMessageSerializerFilter } from './filters/generic-error-handler.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['dist/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ErrorMessageSerializerFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Use 'combined' format to log detailed information about each request
    const morganMiddleware = morgan('dev');

    // Apply the morgan middleware to all routes
    consumer.apply(morganMiddleware).forRoutes('*');
  }
}
