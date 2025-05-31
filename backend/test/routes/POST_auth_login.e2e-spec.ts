import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';

describe('Rota POST "/auth/login"', () => {

    let app: INestApplication<App>;

    let loginBody = {
        email: 'test_login@test.com',
        password: 'test_login'
    }; 

    let user: User;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true}));
        await app.init();
        user = await User.create({
            email: loginBody.email,
            password: await bcrypt.hash(loginBody.password, 10),
            name: 'Test Login'
        });
    });

    afterAll(async () => {
        await User.destroy({where: { email: loginBody.email }});
        await app.close();
    });

    it('Tenta realizar login faltando informação.', async () => {
        for (const key in loginBody) {
            const testBody = { ...loginBody };
            delete testBody[key];
            const response = await sendRequest(app, 'post', '/auth/login', testBody);
            expect(response.status).toBe(400);
        } 
    });

    it('Tenta realizar login com informações corretas.', async () => {
        const response = await sendRequest(app, 'post', '/auth/login', { ...loginBody });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('access_token');
    });

});
