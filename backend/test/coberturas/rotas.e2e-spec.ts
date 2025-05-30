import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { getAllRoutes } from '../helpers/all-rotes-requests';
import { hasE2eSpecFile } from '../helpers/has-e2e_spec_file';


describe('Cobertura de Rotas', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Deve ter teste para todas as rotas', async () => {
    const allRoutes = getAllRoutes(app);

    const notTested = allRoutes.filter(prefix => !hasE2eSpecFile(prefix, 'routes'));

    expect(notTested).toEqual([]);
  });

  afterAll(async () => {
    await app.close();
  });
});
