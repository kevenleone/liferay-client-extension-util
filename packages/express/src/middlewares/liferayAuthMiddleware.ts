import { verify } from "jsonwebtoken";
import jwktopem from "jwk-to-pem";
import type { NextFunction, Request, Response } from "express";

import { parsedEnv, fetcher } from "@liferay-client-extension-util/shared";
import LiferayOAuth2Client from "@liferay-client-extension-util/auth";

import type { LiferayAuthorization } from "../types";

const externalReferenceCodes =
    parsedEnv?.["liferay.oauth.application.external.reference.codes"];

const excludes = parsedEnv?.["liferay.oauth.urls.excludes"] || "";

async function verifyToken(bearerToken: string) {
    const jwks = await fetcher("/o/oauth2/jwks");

    const jwksPublicKey = jwktopem(jwks.keys[0]);

    const decoded = verify(bearerToken, jwksPublicKey, {
        algorithms: ["RS256"],
        ignoreExpiration: true,
    }) as {
        client_id: string;
    };

    return decoded;
}

export async function liferayAuthMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    // Allow preflight requests to pass through
    if (request.method === "OPTIONS" || request.url === "/favicon.ico") {
        return next();
    }

    const excludePaths = excludes.split(",");

    if (excludePaths.includes(request.url)) {
        // No need to validate excluded routes

        return next();
    }

    const { authorization = "" } = request.headers;

    const [, bearerToken] = authorization.split(" ");

    if (!authorization || !bearerToken) {
        response.status(403).json({
            message: "Authorization is missing",
        });

        return;
    }

    const decodedToken = (await verifyToken(
        bearerToken
    )) as LiferayAuthorization;

    for (const externalReferenceCode of externalReferenceCodes ?? []) {
        const clientId = await LiferayOAuth2Client.getClientId(
            externalReferenceCode
        );

        if (clientId === decodedToken.client_id) {
            request.liferayAuthorization = decodedToken;

            return next();
        }
    }

    response.status(401).json({
        message:
            "JWT token client_id value does not match expected client_id value.",
    });
}
