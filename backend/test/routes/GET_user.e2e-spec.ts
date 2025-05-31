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
    email: 'test_get_user@test.com',
    password: 'test_get_user'
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
        name: 'Test Get User',
        roleId: 2
    });

    jwtService = moduleFixture.get(JwtService);

    access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: user.toJSON().roleId });
});

afterAll(async () => {
    await User.destroy({where: { email: body.email }});
    await app.close();
});

describe('Rota GET "/user', () => {


    it('Tenta pegar a informação do usuario sem permissão.', async () => {
        await checarTokenAuth(app, '/user', 'get', access_token);
    });

    it('Tenta pegar a informação do usuario com as permissões corretas.', async () => {
        user.roleId = 1;
        await user.save();

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: 1 });
        const response = await sendRequest(app, 'get', '/user', {}, access_token);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(user.id);
    });

});
