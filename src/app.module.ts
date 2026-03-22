import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // Validación .env
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  //Verificar que la conexión a la base de datos se estableció correctamente
  onModuleInit() {
    this.logger.log(`
    Conexión establecida con la base de datos: ${process.env.DB_NAME}`);
  }
}
