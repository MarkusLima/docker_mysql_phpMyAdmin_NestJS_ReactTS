import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Nome do papel do usuário' })
  name?: string;
}