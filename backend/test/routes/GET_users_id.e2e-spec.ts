import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest, checarTokenAuth } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Rota GET "/users/integer', () => {

    let app: INestApplication<App>;

    let body = {
        email: 'test_get_users_integer@test.com',
        password: 'test_get_users_integer'
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

    it('Tenta listar o usuario sem permissão.', async () => {
        await checarTokenAuth(app, '/users/'+_user.id, 'get', access_token);
    });

    it('Tenta listar o usuário com as permissões corretas.', async () => {
        user.roleId = 1;
        await user.save();

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: 1 });
        const response = await sendRequest(app, 'get', '/users/'+_user.id, {}, access_token);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(_user.id);
    });

    it('Tenta listar o usuário com as permissões corretas, porém id de pesquisa inexistente.', async () => {
        const response = await sendRequest(app, 'get', '/users/999999', {}, access_token);
        expect(response.status).toBe(404);
    });

    it('Tenta listar o usuário com as permissões corretas, porém id de pesquisa inválido.', async () => {
        const response = await sendRequest(app, 'get', '/users/invalido', {}, access_token);
        expect(response.status).toBe(500);
    });

});
