import { INestApplication } from '@nestjs/common';
import request from 'supertest';

async function sendRequest(app: INestApplication, metodo: string, rota: string, args = {}, authToken = null, query = null) {

    let req = request(app.getHttpServer())[metodo](rota);

    // Tratamento para rotas com autenticação
    if (authToken) req = req.set('Authorization', `Bearer ${authToken}`).set('User-Agent', 'localhost');

    // Tratamento para rotas com query params
    if (query) req = req.query(query);

    return req.send(args);
}

async function checarTokenAuth(app: INestApplication<any>, rota: any, metodo: any, tokenAuthSemPermissao = null, body = {}) {
    // Faz a solicitação
    const response = await sendRequest(app, metodo, rota, body);

    // Verifique se a resposta está correta
    expect(response.status).toBe(401);

    // Faz a solicitação
    const response2 = await sendRequest(app, metodo, rota, body, 'token-invalido');

    // Verifique se a resposta está correta
    expect(response2.status).toBe(401);

    if (tokenAuthSemPermissao) {
        // Faz a solicitação
        const response3 = await sendRequest(app, metodo, rota, body, tokenAuthSemPermissao);

        // Verifique se a resposta está correta
        expect(response3.status).toBe(403);
    }
}

export { sendRequest, checarTokenAuth };