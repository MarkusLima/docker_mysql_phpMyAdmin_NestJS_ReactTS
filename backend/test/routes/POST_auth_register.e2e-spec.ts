import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';

describe('Rota POST "/auth/register"', () => {

    let app: INestApplication<App>;

    let body = {
        email: 'test_regiter@test.com',
        password: 'test_regiter',
        name: 'Test Register'
    };

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true}));
        await app.init();
    });

    afterAll(async () => {
        await User.destroy({where: { email: body.email }});
        await app.close();
    });

    it('Tenta criar usuário faltando informação.', async () => {
        for (const key in body) {
            const testBody = { ...body };
            delete testBody[key];
            const response = await sendRequest(app, 'post', '/auth/register', testBody);
            expect(response.status).toBe(400);
        } 
    });

    it('Tenta criar usuário com informações corretas.', async () => {
        const response = await sendRequest(app, 'post', '/auth/register', body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('access_token');
    });

    it('Tenta criar usuário com email já cadastrado.', async () => {
        const response = await sendRequest(app, 'post', '/auth/register', body);
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email já cadastrado');
    });

    it('Tenta criar usuário com email inválido.', async () => {
        const response = await sendRequest(app, 'post', '/auth/register', { ...body, email: 'invalid-email' });
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('O email deve ser um email válido');
    });

});
