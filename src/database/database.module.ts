import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Importación global para que PrismaService esté disponible en toda la aplicación sin necesidad de importarlo en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
