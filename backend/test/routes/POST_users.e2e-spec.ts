import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest, checarTokenAuth } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

let app: INestApplication<App>;

let body = {
    email: 'test_post_user@test.com',
    password: 'test_post_user'
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
        name: 'Test POST User',
        roleId: 2
    });

    jwtService = moduleFixture.get(JwtService);

    access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: user.toJSON().roleId });
});

afterAll(async () => {
    await User.destroy({where: { id: user.id }});
    await app.close();
});

describe('Rota POST "/users', () => {


    it('Tenta criar um usuario sem permissão.', async () => {
        const _body = { ...body, roleId: 1, name: 'Test POST User' };
        await checarTokenAuth(app, '/users', 'post', access_token, _body);
    });

    it('Tenta criar um usuario com as permissões corretas.', async () => {
        user.roleId = 1;
        await user.save();

        const _body = { ...body, roleId: 1, name: 'Test POST User' };
        _body.email = _body.email + '.br';

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: 1 });
        const response = await sendRequest(app, 'post', '/users', _body, access_token);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');

        await User.destroy({ where: { id: response.body.id } });
    });

});
