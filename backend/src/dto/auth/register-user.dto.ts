import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserAuthDto {
    
    @ApiProperty({ example: 'Mark Zuckerberg', description: 'Nome do usuário' })
    @IsNotEmpty({ message: 'O name é obrigatório' })
    @IsString({ message: 'O name deve ser uma string' })
    name: string;

    @ApiProperty({ example: 'mark@facebook.com.br', description: 'Email do usuário' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({}, { message: 'O email deve ser um email válido' })
    email: string;

    @ApiProperty({ example: 'fibonacci', description: 'Senha do usuário' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
    password: string;
}