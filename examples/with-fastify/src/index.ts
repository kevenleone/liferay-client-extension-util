import fastify from 'fastify';

import LiferayOAuth2Client from '@client-extension-util-liferay/auth';
import liferayFastify from '@client-extension-util-liferay/fastify';

const PORT = Number(Bun.env.PORT || 3001);

const app = fastify();

app.register(liferayFastify);

app.get('/', async (request, reply) => {
    const fetchResponse = await fetch(`http://localhost:${PORT}/protected`, {
        headers: {
            Authorization: await LiferayOAuth2Client.getAuthorization(
                'liferay-marketplace-etc-spring-boot-oauth-application-headless-server',
            ),
        },
    });

    return fetchResponse;
});

app.get('/protected', (request, reply) => ({
    liferayAuthorization: request.liferayAuthorization,
    message: 'Accessing a protected route',
}));

app.get('/ready', async () => ({ message: 'Ready' }));

app.listen({ port: PORT }, () => {
    console.log(`App running ${PORT}`);
});
