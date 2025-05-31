import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest, checarTokenAuth } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Rota GET "/users', () => {

    let app: INestApplication<App>;

    let body = {
        email: 'test_get_users@test.com',
        password: 'test_get_users'
    }; 

    let user: User;
    let _user: User;
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
            name: 'Test Get Users',
            roleId: 2
        });

        _user = await User.create({
            email: '_'+body.email,
            password: await bcrypt.hash(body.password, 10),
            name: 'Test Get Users',
            roleId: 2
        });

        jwtService = moduleFixture.get(JwtService);
        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: user.toJSON().roleId });
    });

    afterAll(async () => {
        await User.destroy({where: { email: body.email }});
        await User.destroy({where: { email: '_'+body.email }});
        await app.close();
    });

    it('Tenta listar os usuarios sem permissão.', async () => {
        await checarTokenAuth(app, '/users', 'get', access_token);
    });

    it('Tenta listar os usuários com as permissões corretas.', async () => {
        // Atualiza o usuário para ter a roleId 2 (que deve ter permissão para acessar as rotas)
        user.roleId = 1;
        await user.save();

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: user.roleId });
        const response = await sendRequest(app, 'get', '/users', {}, access_token);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

});
