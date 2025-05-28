import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 1, description: 'Id do role' })
  @IsNotEmpty()
  @IsInt()
  roleId: number;

  @ApiProperty({ example: 1, description: 'Id do route' })
  @IsNotEmpty()
  @IsInt()
  routeId: number;
}
