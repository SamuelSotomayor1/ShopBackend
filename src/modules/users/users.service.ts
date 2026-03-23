import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  //Crear usuario con hash de contraseña
  async create(createUserDto: CreateUserDto) {
    const { email, password, ...userData } = createUserDto;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.prisma.user.create({
        data: {
          ...userData,
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: Role.USER,
        },
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError.code === 'P2002') {
        throw new ConflictException('Email ya registrado');
      }
      this.logger.error('Error no controlado al crear usuario:', error);
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  //Obtener todos los usuarios por Rol
  async findAll(role?: Role) {
    return this.prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  //Obtener usuario por ID
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  //Actualizar usuario por ID
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;
    const dataToUpdate: Prisma.UserUpdateInput = { ...userData };

    //Si el usuario quiere actualizar la contraseña, la hasheamos antes de guardarla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError.code === 'P2025') {
        throw new NotFoundException(
          `No se pudo actualizar: Usuario no encontrado`,
        );
      }
      this.logger.error('Error al actualizar usuario:', error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `No se pudo eliminar: El usuario con ID ${id} no existe`,
          );
        }
      }
      // Si es un error de base de datos o de red, lo loggeamos y lanzamos 500
      this.logger.error(`Error crítico al eliminar usuario ${id}:`, error);
      throw new InternalServerErrorException(
        'Error interno al intentar eliminar el usuario',
      );
    }
  }
}
