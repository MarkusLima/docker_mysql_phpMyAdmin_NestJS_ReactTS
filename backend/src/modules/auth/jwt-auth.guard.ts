import { AuthGuard } from '@nestjs/passport';
import { Injectable, Scope  } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}