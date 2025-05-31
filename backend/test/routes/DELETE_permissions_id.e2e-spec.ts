import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { sendRequest, checarTokenAuth } from '../helpers/run-test';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Permission } from 'src/modules/permissions/permissions.model';

describe('Rota PUT "/permissions/:id', () => {

    let app: INestApplication<App>;

    let body = {
        email: 'test_delete_permissions_id@test.com',
        password: 'test_delete_permissions_id'
    }; 

    let user: User;
    let permission: Permission;
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
            name: 'Test DELETE Permissions Id',
            roleId: 2
        });

        permission = await Permission.create({
            routeId: 1,
            roleId: 2
        });

        jwtService = moduleFixture.get(JwtService);

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: user.toJSON().roleId });
    });

    afterAll(async () => {
        await User.destroy({where: { id: user.id }});
        await Permission.destroy({where: { id: permission.id }});
        await app.close();
    });

    it('Tenta deletar a permissão sem o devido acesso.', async () => {
        await checarTokenAuth(app, '/permissions/'+permission.id, 'delete', access_token);
    });

    it('Tenta deletar a permissão com as permissões corretas.', async () => {
        user.roleId = 1;
        await user.save();

        access_token = jwtService.sign({ sub: user.id, email: user.toJSON().email, roleId: 1 });
        const response = await sendRequest(app, 'delete', '/permissions/'+permission.id, {}, access_token);
        expect(response.status).toBe(200);
    });

});
