import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  CLIENT = 'client',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'El formato del correo electrónico es inválido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser "admin" o "user"' })
  @IsOptional()
  role: UserRole;
}
