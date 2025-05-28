import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-route.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}