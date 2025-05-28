import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    
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
    @IsString({ message: 'O email deve ser uma string' })
    @MinLength(4, { message: 'A senha deve ter pelo menos 4 caracteres' })
    password: string;

    @ApiProperty({ example: 1, description: 'Id do role' })
    @IsNotEmpty({ message: 'O id é obrigatório' })
    @IsInt({ message: 'O id deve ser um número' })
    roleId: number;
}