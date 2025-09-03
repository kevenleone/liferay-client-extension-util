import { verify } from 'jsonwebtoken';
import jwktopem from 'jwk-to-pem';
import type { NextFunction, Request, Response } from 'express';

import {
    type LiferayAuthorization,
    parsedEnv,
    fetcher,
} from '@client-extension-util-liferay/shared';
import LiferayOAuth2Client from '@client-extension-util-liferay/auth';

const externalReferenceCodes =
    parsedEnv?.['liferay.oauth.application.external.reference.codes'];

const excludes = parsedEnv?.['liferay.oauth.urls.excludes'] || '';

async function verifyToken(bearerToken: string) {
    const jwks = await fetcher('/o/oauth2/jwks');

    const jwksPublicKey = jwktopem(jwks.keys[0]);

    const decoded = verify(bearerToken, jwksPublicKey, {
        algorithms: ['RS256'],
        ignoreExpiration: true,
    }) as LiferayAuthorization;

    return decoded;
}

export async function liferayAuthMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    // Allow preflight requests to pass through
    if (request.method === 'OPTIONS' || request.url === '/favicon.ico') {
        return next();
    }

    const { authorization = '' } = request.headers;

    const [, bearerToken] = authorization.split(' ');
    const excludePaths = excludes.split(',');

    if (excludePaths.includes(request.url)) {
        // No need to validate excluded routes

        if (bearerToken) {
            request.liferayAuthorization = await verifyToken(bearerToken);
        }

        return next();
    }

    if (!authorization || !bearerToken) {
        return response.status(403).json({
            message: 'Authorization is missing',
        });
    }

    const decodedToken = await verifyToken(bearerToken);

    for (const externalReferenceCode of externalReferenceCodes ?? []) {
        const clientId = await LiferayOAuth2Client.getClientId(
            externalReferenceCode,
        );

        if (clientId === decodedToken.client_id) {
            request.liferayAuthorization = decodedToken;

            return next();
        }
    }

    response.status(401).json({
        message:
            'JWT token client_id value does not match expected client_id value.',
    });
}
