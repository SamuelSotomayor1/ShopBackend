import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//PartialType hace que todas las propiedades de CreateUserDto sean opcionales para UpdateUserDto, lo que es útil para actualizaciones parciales
export class UpdateUserDto extends PartialType(CreateUserDto) {}
