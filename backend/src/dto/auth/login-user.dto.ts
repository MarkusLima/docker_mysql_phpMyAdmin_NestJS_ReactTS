import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {

    @ApiProperty({ example: 'mark@facebook.com.br', description: 'Email do usuário' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({}, { message: 'O email deve ser um email válido' })
    email: string;

    @ApiProperty({ example: 'fibonacci', description: 'Senha do usuário' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    password: string;
}