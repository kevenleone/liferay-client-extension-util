import fastifyPlugin from "fastify-plugin";
import { verify } from "jsonwebtoken";
import jwktopem from "jwk-to-pem";

import LiferayOAuth2Client from "@liferay-client-extension-util/auth";
import { parsedEnv, fetcher } from "@liferay-client-extension-util/shared";
import type { LiferayAuthorization } from "@liferay-client-extension-util/shared";

const externalReferenceCodes =
    parsedEnv?.["liferay.oauth.application.external.reference.codes"];

const excludes = parsedEnv?.["liferay.oauth.urls.excludes"] || "";

async function verifyToken(bearerToken: string) {
    const jwks = await fetcher("/o/oauth2/jwks");
    const jwksPublicKey = jwktopem(jwks.keys[0]);

    const decoded = verify(bearerToken, jwksPublicKey, {
        algorithms: ["RS256"],
        ignoreExpiration: true,
    }) as LiferayAuthorization;

    return decoded;
}

export default fastifyPlugin(async function liferayAuthPlugin(fastify) {
    const excludePaths = excludes.split(",");

    fastify.decorateRequest("liferayAuthorization");

    fastify.addHook("preHandler", async (request, reply) => {
        if (request.method === "OPTIONS" || request.url === "/favicon.ico") {
            return;
        }

        if (excludePaths.includes(request.url)) {
            return;
        }

        const { authorization = "" } = request.headers as Record<
            string,
            string
        >;
        const [, bearerToken] = authorization.split(" ");

        if (!authorization || !bearerToken) {
            return reply.code(403).send({
                message: "Authorization is missing",
            });
        }

        const decodedToken = await verifyToken(bearerToken);

        for (const externalReferenceCode of externalReferenceCodes ?? []) {
            const clientId = await LiferayOAuth2Client.getClientId(
                externalReferenceCode
            );

            if (clientId === decodedToken.client_id) {
                request.liferayAuthorization = decodedToken;
                return;
            }
        }

        reply.code(401).send({
            message:
                "JWT token client_id value does not match expected client_id value.",
        });
    });
});
