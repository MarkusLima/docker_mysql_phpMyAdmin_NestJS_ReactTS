import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest, checarTokenAuth } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/modules/roles/roles.model';

let app: INestApplication<App>;

let body = {
    password: 'test_post_role',
    email: 'test_post_role@test.com'
}; 

let user: User;
let jwtService: JwtService;
let access_token: string;

beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Cria o usuário de teste
    user = await User.create({
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        name: 'Test POST Role',
        roleId: 2
    });

    jwtService = moduleFixture.get(JwtService);

    access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: user.toJSON().roleId });
});

afterAll(async () => {
    await User.destroy({where: { id: user.id }});
    await app.close();
});

describe('Rota POST "/roles', () => {

    it('Tenta recuperar o role sem permissão.', async () => {
        await checarTokenAuth(app, '/roles', 'post', access_token, { name: 'Name Teste' });
    });

    it('Tenta recuperar o role com as permissões corretas.', async () => {
        user.roleId = 1;
        await user.save();

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: 1 });
        const response = await sendRequest(app, 'post', '/roles', {name: 'Name Teste'}, access_token);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Name Teste');
        await Role.destroy({ where: { id: response.body.id } });
    });

});
