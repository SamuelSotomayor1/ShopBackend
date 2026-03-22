import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Creamos el pool de conexiones
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 2. Instanciamos el adaptador
    const adapter = new PrismaPg(pool);

    // 3. PASO CRUCIAL: Pasamos el adaptador al constructor de PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Error conectando a PostgreSQL:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
