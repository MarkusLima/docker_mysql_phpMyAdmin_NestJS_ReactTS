import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Nome do papel do usuário' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;
}